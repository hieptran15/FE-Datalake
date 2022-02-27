import {
  AfterViewInit,
  ChangeDetectorRef,
  Compiler,
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import * as go from 'gojs';
import {DataSyncService, DiagramComponent} from 'gojs-angular';
import {HttpClient} from '@angular/common/http';
import {ApplicationClusterService} from '../../services/application-cluster.service';
import {MAX_SAFE_INTEGER} from '../../share/common.constant';
import {ApplicationNodeService} from '../../services/application-node.service';
import {LinkService} from '../../services/link.service';
import {NbDialogService, NbIconLibraries, NbToastrService} from '@nebular/theme';
import {ApplicationClusterDialogComponent} from './application-cluster-dialog/application-cluster-dialog.component';
import {ApplicationNodeDialogComponent} from './application-node-dialog/application-node-dialog.component';
import {LinkDialogComponent} from './link-dialog/link-dialog.component';
import {environment} from '../../../environments/environment';
import {concat, forkJoin, Observable, of, Subject} from 'rxjs';
import {catchError, distinctUntilChanged, map, switchMap, tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {DashboardService} from '../../services/dashboard.service';
import {AuthoritiesConstant} from '../../authorities.constant';
import {AccountService} from '../../@core/auth/account.service';


@Component({
  selector: 'ngx-graph-dashboard',
  templateUrl: './graph-page.component.html',
  styleUrls: ['./graph-page.component.scss'],
})
export class GraphPageComponent implements OnInit, AfterViewInit, OnDestroy {
  applicationClusters: any;
  applicationNodes: any;
  private links: any;
  nodeChanges = new Map()
  clusterChanges = new Map();
  clusters$: Observable<any[]>;
  checkerrorServer: boolean = false;
  clustersInput$ = new Subject<string>();
  clustersLoading = false;
  cluster: any;
  isEditing: any;
  isHideLink = true;
  editable: any = true;
  @ViewChild('myDiagram', {static: true}) public myDiagramComponent: DiagramComponent;
  breadcrumb: any[] = [];
  diagramNodeData: Array<go.ObjectData> = [];
  diagramLinkData: Array<go.ObjectData> = [];
  diagramDivClassName = 'myDiagramDiv';
  diagramModelData: go.ObjectData = {prop: 'value'};
  authoritiesConstant = AuthoritiesConstant
  // Overview Component testing
  oDivClassName = 'myOverviewDiv';
  observedDiagram = null;
  mySubscription: any;
  // currently selected node; for inspector
  selectedNode: go.Node | null = null;
  oldCluster: any;
  lastClickTime = new Date();
  skipsDiagramUpdate = false;

  constructor(private cdr: ChangeDetectorRef, private http: HttpClient,
              private applicationClusterService: ApplicationClusterService,
              private linkService: LinkService,
              public dialogService: NbDialogService,
              private router: Router,
              private accountService: AccountService,
              private applicationNodeService: ApplicationNodeService,
              private toastrService: NbToastrService,
              private _compiler: Compiler,
              private iconsLibrary: NbIconLibraries,
              private dashboardService: DashboardService) {
    _compiler.clearCache();
    iconsLibrary.registerFontPack('fa', {packClass: 'fa', iconClassPrefix: 'fa'});
    iconsLibrary.registerFontPack('far', {packClass: 'far', iconClassPrefix: 'fa'});
  }

  ngOnInit(): void {
    this.checkServer();
    this.clusters$ = concat(
      of([]), // default items
      this.clustersInput$.pipe(
        distinctUntilChanged(),
        tap(() => this.clustersLoading = true),
        switchMap(term => this.dashboardService.query({
          keyword: term,
        }).pipe(
          catchError(() => of([])), // empty list on error
          tap(() => this.clustersLoading = false),
          map(res => res.body)
        ))
      )
    );

    this.search();
    this.mySubscription = this.router.events.subscribe((event: any) => {
      // if (event.url === '/pages/dashboard') {
      //   window.location.reload()
      // }
    });
  }

  checkServer() {
    this.accountService.identity().subscribe(res => {
      if (res === null) {
        this.checkerrorServer = true;
      } else {
        this.checkerrorServer = false;
      }
    })
  }

  loadBreadcrumb() {
    this.breadcrumb = [];
    if (this.cluster && this.cluster.path) {
      const paths = this.cluster.path.substr(1, this.cluster.path.length - 2).split('/');
      const clusterIds = [];
      for (let i = 0; i < paths.length - 1; i++) {
        clusterIds.push(parseInt(paths[i].substr(1), 10));
      }
      if (clusterIds.length > 0) {
        this.applicationClusterService.findByIds(clusterIds).subscribe(res => {
          if (res.body) {
            for (const item of res.body) {
              this.breadcrumb.push({label: item.clusterName, path: item.treePath})
            }
            this.breadcrumb.push({label: this.cluster.name, path: this.cluster.treePath})
          }
        });
      } else {
        this.breadcrumb.push(this.cluster)
      }
    }
  }

  ngOnDestroy() {
  }

  changeBreadcrumb(number) {
    if (number >= this.breadcrumb.length - 1) return;

    const dataPath = Object.assign([], this.breadcrumb)
    this.breadcrumb = dataPath.slice(0, number + 1);
    const clusterPath = this.breadcrumb[this.breadcrumb.length - 1]?.path || '';
    if (clusterPath) {
      const paths = clusterPath.split('/');
      if (paths.length > 0) {
        const clusterId = parseInt(paths[paths.length - 2].substr(1), 10);
        const label = this.breadcrumb.map(c => c.label).join(' / ');
        this.cluster = {
          id: clusterId,
          path: clusterPath,
          label: label
        };
      }
    }

    this.search(false);
  }

  search(loadBreadcrumb: boolean = true) {
    this.oldCluster = this.cluster;
    this.diagramNodeData = [];
    this.diagramLinkData = [];
    this.editable = !(this.cluster && this.cluster.treePath);

    let promises: any[];
    if (this.cluster) {
      promises = [
        this.applicationClusterService.query({
          size: MAX_SAFE_INTEGER,
          page: 0,
          treePath: this.cluster ? this.cluster.path : ''
        }),
        this.applicationNodeService.getAllForGraph({
          treePath: this.cluster ? this.cluster.path : ''
        }),
      ];
    } else {
      promises = [
        this.applicationClusterService.query({
          size: MAX_SAFE_INTEGER,
          page: 0,
          treePath: this.cluster ? this.cluster.path : ''
        }),
        this.applicationNodeService.getAllForGraph({
          treePath: this.cluster ? this.cluster.path : ''
        })
      ];
    }
    forkJoin(promises).subscribe((res: any[]) => {
      this.applicationClusters = res[0]?.body || [];
      this.applicationNodes = res[1]?.body || [];
      const clusterIds = this.applicationClusters.map(c => c.id);
      const nodeIds = this.applicationNodes.map(c => c.id);
      this.linkService.query({
        clusterIds: clusterIds,
        nodeIds: nodeIds,
        size: MAX_SAFE_INTEGER,
        page: 0
      }).subscribe(res2 => {
        this.links = res2?.body || [];
        if (!this.isHideLink) {
          this.hideRelation();
        }
        this.drawDiagram();
      })
    }, (err) => {
      console.log(err);
      this.toastrService.danger('Có lỗi xảy ra. Vui lòng thử lại sau.', 'Lỗi', {icon: 'alert-triangle-outline'});
    })
    if (loadBreadcrumb)
      this.loadBreadcrumb();
  }

  drawDiagram() {
    if (this.applicationClusters) {
      const clusterData = (this.applicationClusters.map(data => {
        let tempData: any = [];
        if (data && data.style) {
          tempData = JSON.parse(data.style)
        }
        if (data.parentId) {
          return {
            displayType: 'cluster',
            baseObject: data,
            background: tempData.background || '#dee1ea',
            borderColor: tempData.borderColor || '#d14d4d',
            textColor: tempData.textColor || '#9e3a49',
            loc: tempData.loc,
            id: data.id,
            borderType: tempData.borderStyle,
            key: 'c' + data.id,
            group: 'c' + data.parentId,
            label: data.clusterName,
            isGroup: true
          }
        } else {
          return {
            displayType: 'cluster',
            baseObject: data,
            loc: tempData.loc,
            background: tempData.background || '#d4daee',
            borderColor: tempData.borderColor || '#d14d4d',
            textColor: tempData.textColor || '#9e3a49',
            borderType: tempData.borderStyle,
            id: data.id,
            key: 'c' + data.id,
            label: data.clusterName,
            isGroup: true
          }
        }
      }));
      console.log('Cluster: ', clusterData);
      this.diagramNodeData = [...this.diagramNodeData, ...clusterData]
    }
    if (this.applicationNodes) {
      const nodeData = this.applicationNodes.map(data => {
        if (data.style) {
          const style = JSON.parse(data.style)
          return {
            displayType: 'node',
            background: style.background || '#1d51d7',
            borderColor: style.borderColor || '#d14d4d',
            textColor: style.textColor || '#9e3a49',
            loc: style.loc,
            baseObject: data,
            imageUrl: data.iconId ? (environment.imageUrl + data.iconId) : '',
            key: 'n' + data.id,
            label: data.nodeName,
            group: 'c' + data.clusterId
          }
        }
        return {
          displayType: 'node',
          baseObject: data,
          key: 'n' + data.id,
          imageUrl: data.iconId ? (environment.imageUrl + data.iconId) : '',
          label: data.nodeName,
          group: 'c' + data.clusterId
        }
      })
      this.diagramNodeData = [...this.diagramNodeData, ...nodeData]
    }
    if (this.links) {
      const linkData = this.links.map(data => {
        let tempData: any = {};
        if (data && data.style) {
          tempData = JSON.parse(data.style)
        }
        if (tempData.points) {
          return {
            baseObject: data,
            key: 'l' + data.id,
            background: tempData.background || '#dee1ea',
            borderColor: tempData.borderColor || '#d14d4d',
            textColor: tempData.textColor || '#9e3a49',
            borderType: tempData.borderStyle,
            fromPort: tempData.fromPort || 'R',
            toPort: tempData.toPort || 'L',
            points: tempData.points || [],
            from: data.leftClusterId ? ('c' + data.leftClusterId) : ('n' + data.leftNodeId),
            to: data.rightClusterId ? ('c' + data.rightClusterId) : ('n' + data.rightNodeId),
            label: data.label,
            visible: this.isHideLink
          }
        }
        return {
          baseObject: data,
          key: 'l' + data.id,
          background: tempData.background || '#dee1ea',
          borderColor: tempData.borderColor || '#d14d4d',
          textColor: tempData.textColor || '#9e3a49',
          borderType: tempData.borderStyle,
          from: data.leftClusterId ? ('c' + data.leftClusterId) : ('n' + data.leftNodeId),
          to: data.rightClusterId ? ('c' + data.rightClusterId) : ('n' + data.rightNodeId),
          label: data.label,
          visible: this.isHideLink
        }
      })
      this.diagramLinkData = [...this.diagramLinkData, ...linkData]
    }

    const dataModel = {
      // linkFromPortIdProperty: 'fromPort',
      // linkToPortIdProperty: 'toPort',
      linkKeyProperty: 'key',
      nodeDataArray: this.diagramNodeData,
      linkDataArray: this.diagramLinkData
    }

    this.myDiagramComponent.diagram.model = go.Model.fromJson(JSON.stringify(dataModel));
    this.myDiagramComponent.diagram.redraw();
  }

  hideRelation(changeIsHideLink?) {
    if (changeIsHideLink)
      this.isHideLink = !this.isHideLink;
    this.diagramLinkData = this.diagramLinkData.map(l => {
      l.visible = this.isHideLink;
      return l;
    })

    this.myDiagramComponent.diagram.model.commit((m) => {
      this.diagramLinkData.forEach(l => {
        const link = this.myDiagramComponent.diagram.findLinkForKey(l.key);
        m.setDataProperty(link, 'visible', this.isHideLink);
      });
    })
  }

  // initialize diagram / templates
  initDiagram(): go.Diagram {
    const maker = go.GraphObject.make;
    const dia = maker(go.Diagram, {
      'undoManager.isEnabled': true,
      model: maker(go.GraphLinksModel,
        {
          linkKeyProperty: 'key', // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
        },
      ),
      isReadOnly: true,
      initialAutoScale: go.Diagram.UniformToFill,
      // autoScale: go.Diagram.Uniform,
      contentAlignment: go.Spot.Center,
      padding: new go.Margin(50, 50, 50, 250),
      // layout: maker(go.LayeredDigraphLayout,
      //   {
      //     isInitial: false,
      //     isOngoing: false
      //   }),
      maxSelectionCount: 2,
      'animationManager.isEnabled': true,
      allowClipboard: false,
      allowCopy: false,
      allowDelete: false,
      allowInsert: false,
      'draggingTool.isGridSnapEnabled': false,
      'draggingTool.isCopyEnabled': false,
      'LinkReshaped': function (e) {
        e.subject.routing = go.Link.Orthogonal;
      },
    });

    function setSize(imagePath) {
      if (imagePath) {
        return 50
      } else {
        return 0
      }
    }

    function setWidth(label) {
      if (label && label.length > 20) {
        return 150
      } else {
        return undefined
      }
    }

    function setMarginIcon(imagePath) {
      if (imagePath) {
        return 5
      } else {
        return 0
      }
    }

    function border(borderType) {
      switch (borderType) {
        case 'dotted':
          return [2, 2]
        case 'solid':
          return [15, 0]
        case 'dashed':
          return [15, 5]
        default:
          return [15, 0]
      }
    }

    // define overview
    maker(go.Overview, 'myOverviewDiv', {observed: dia});
    // define the Node template
    dia.nodeTemplate =
      maker(go.Node, 'Auto',
        {
          locationObjectName: 'ICON'
        },
        new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
        maker(go.Shape, 'Rectangle',  // surrounds the Placeholder
          {
            fill: '#ffffff',
            // border style
            stroke: '#000000',
            strokeWidth: 2,
            strokeDashArray: [15, 0]
          },
          new go.Binding('strokeDashArray', 'borderType', border),
          // Config color background clude
          new go.Binding('fill', 'background'),
          // Config color border
          new go.Binding('stroke', 'borderColor'),
        ),
        maker(go.Panel, 'Vertical',
          maker(go.Panel, 'Auto',
            {name: 'ICON'},
            maker(go.Picture,
              {margin: 0},
              new go.Binding('margin', 'imageUrl', setMarginIcon),
              new go.Binding('source', 'imageUrl'),
              new go.Binding('width', 'imageUrl', setSize),
              new go.Binding('height', 'imageUrl', setSize),
              new go.Binding('desiredSize', 'type', new go.Size(55, 55) as any)),
          ),  // end Spot Panel
          maker(go.TextBlock,
            {
              margin: 10, font: 'Normal 14px Sans-Serif', stroke: 'black', overflow: go.TextBlock.OverflowEllipsis,
              maxLines: 3
            },
            new go.Binding('width', 'label', setWidth),
            new go.Binding('text', 'label'),
            new go.Binding('stroke', 'textColor')
          ),
        ),
      );

    dia.groupTemplate =
      maker(go.Group, 'Vertical',
        new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
        maker(go.TextBlock,         // group title
          {
            alignment: go.Spot.TopLeft, alignmentFocus: go.Spot.TopLeft,
            font: '500 14pt Sans-Serif',
            stroke: '#000000',
            verticalAlignment: go.Spot.Bottom,
            margin: new go.Margin(0, 0, 0, 5),
            position: new go.Point(0, 0),
            visible: true,
            overflow: go.TextBlock.OverflowEllipsis,
            maxLines: 3,
          },
          new go.Binding('width', 'label', setWidth),
          new go.Binding('text', 'label'),
          new go.Binding('stroke', 'textColor')
        ),
        maker(go.Panel, 'Auto',
          // new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
          maker(go.Shape, 'RoundedRectangle',  // surrounds the Placeholder
            {
              // background
              fill: '#ffffff',
              // border style
              stroke: '#000000',
              strokeWidth: 2,
              strokeDashArray: [15, 0]
            },
            new go.Binding('strokeDashArray', 'borderType', border),
            // new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
            // Config color background cluster
            new go.Binding('fill', 'background'),
            // Config color border
            new go.Binding('stroke', 'borderColor'),
          ),
          maker(go.Placeholder,    // represents the area of all member parts,
            {padding: 15}),  // with some extra padding around them
        ),
      );

    dia.linkTemplate =
      maker(go.Link,
        {
          routing: go.Link.AvoidsNodes,
          curve: go.Link.JumpOver,
          adjusting: go.Link.Stretch,
          corner: 5,
          toShortLength: 4,
          relinkableFrom: true,
          relinkableTo: true,
          reshapable: true,
          resegmentable: true
        },  // link route should avoid nodes
        new go.Binding('visible', 'visible'),
        new go.Binding('points', 'points').makeTwoWay(),
        new go.Binding('routing', 'routing', go.Binding.parseEnum(go.Link, go.Link.AvoidsNodes))
          .makeTwoWay(go.Binding.toString),
        maker(go.Shape, {
            stroke: '#000000',
            strokeWidth: 2,
            // dash style
            strokeDashArray: [15, 0],
            parameter1: 14,
          },
          new go.Binding('strokeDashArray', 'borderType', border),

          // Config color background clude
          new go.Binding('fill', 'borderColor'),
          // Config color border
          new go.Binding('stroke', 'borderColor'),
        ),
        maker(go.Shape,
          {
            toArrow: 'Standard',
            stroke: '#000000',
            fill: '#000000',
          },
          // Config color background clude
          new go.Binding('fill', 'borderColor'),
          // Config color border
          new go.Binding('stroke', 'borderColor')
        ),

        maker(go.TextBlock, {
            overflow: go.TextBlock.OverflowEllipsis,
            maxLines: 3
          },
          new go.Binding('width', 'label', setWidth), // this is a Link label
          new go.Binding('text', 'label'),
          new go.Binding('stroke', 'textColor'),
        )
      );

    dia.model = maker(go.GraphLinksModel,
      {
        linkKeyProperty: 'key'  // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
      });

    return dia;
  }

  // When the diagram model changes, update app data to reflect those changes
  diagramModelChange(changes: go.IncrementalData) {
    this.skipsDiagramUpdate = true;
    this.diagramNodeData = DataSyncService.syncNodeData(changes, this.diagramNodeData);
    this.diagramLinkData = DataSyncService.syncLinkData(changes, this.diagramLinkData);
    this.diagramModelData = DataSyncService.syncModelData(changes, this.diagramModelData);
  };

  initOverview(): go.Overview {
    const maker = go.GraphObject.make;
    return maker(go.Overview);
  }

  ngAfterViewInit() {

    if (this.observedDiagram) {
      return;
    }
    this.observedDiagram = this.myDiagramComponent?.diagram;
    this.cdr.detectChanges();
    const appComp: GraphPageComponent = this;
    // listener for inspector
    this.myDiagramComponent?.diagram.addDiagramListener('ObjectSingleClicked', function (e) {
      if (e.diagram.selection.count === 0) {
        appComp.selectedNode = null;
      }
      if (appComp.isEditing) return;
      const node: any = e.diagram.selection.first();
      if (node instanceof go.Node) {
        appComp.selectedNode = node;
        appComp.openNode(node);
      } else if (node instanceof go.Link) {
        appComp.openLink(node);
      } else {
        appComp.selectedNode = null;
      }
    });
    this.myDiagramComponent?.diagram.addDiagramListener('ObjectDoubleClicked', function (e) {
      appComp.lastClickTime = new Date();
      const node: any = e.diagram.selection.first();
      appComp.openUrlOfNode(node);
    });
  } // end ngAfterViewInit
  loading: any;

  // isShow: any;

  openNode(node) {
    if (node && node.hb && node.hb.baseObject && node.hb.displayType === 'cluster') {
      this.dialogService.open(ApplicationClusterDialogComponent, {
        autoFocus: false,
        closeOnBackdropClick: false,
        context: {
          data: node.hb.baseObject
        },
      }).onClose.subscribe(res => {
        if (res) {
          this.search();
        }
      });
    } else if (node && node.hb && node.hb.baseObject && node.hb.displayType === 'node') {
      const clickTime = new Date();
      this.lastClickTime = clickTime;
      setTimeout(() => {
        if (this.lastClickTime === clickTime) {
          this.dialogService.open(ApplicationNodeDialogComponent, {
            autoFocus: false,
            closeOnBackdropClick: false,
            context: {
              data: node.hb.baseObject
            },
          }).onClose.subscribe(res => {
            if (res) {
              this.search();
            }
          });
        }
      }, 500);
    }
  }

  openLink(link) {
    this.dialogService.open(LinkDialogComponent, {
      autoFocus: false,
      closeOnBackdropClick: false,
      context: {
        data: link.hb.baseObject
      },
    });
  }

  openUrlOfNode(node) {
    if (node && node.hb && node.hb.baseObject && node.hb.displayType === 'node' && node.hb.baseObject.url) {
      window.open(node.hb.baseObject.url, '_blank');
    }
  }

  editDiagram(mode?: boolean) {
    mode = mode === undefined ? true : mode;
    this.isEditing = mode;
    this.myDiagramComponent.diagram.isReadOnly = !mode;
    if (!mode) {
      this.cluster = this.oldCluster;
      this.search();
    }
  }

  saveDiagram() {
    this.loading = true
    const nodeData = [];
    const clusterData = [];
    const linkData = [];
    const dataModel = this.myDiagramComponent.diagram.model.toJson();
    const nodeDataArray = JSON.parse(dataModel).nodeDataArray;
    for (let i = 0; i < nodeDataArray.length; i++) {
      const res = nodeDataArray[i];
      const data = res.baseObject;
      if (data.style) {
        data.style = JSON.parse(data.style);
        data.style.loc = res.loc
        data.style = JSON.stringify(data.style)
      } else {
        data.style = JSON.stringify({
          loc: res.loc
        })
      }
      if (res.displayType === 'cluster') {
        clusterData.push(data)
      } else if (res.displayType === 'node') {
        nodeData.push(data)
      }
    }
    const linkDataArray = JSON.parse(dataModel).linkDataArray;
    for (let i = 0; i < linkDataArray.length; i++) {
      const res = linkDataArray[i];
      const data = res.baseObject;
      if (data.style) {
        data.style = JSON.parse(data.style);
        data.style.points = res.points
        data.style.fromPort = res.fromPort;
        data.style.toPort = res.toPort;
        data.style = JSON.stringify(data.style)
      } else {
        data.style = JSON.stringify({
          points: res.points,
          fromPort: res.fromPort,
          toPort: res.toPort,
        })
      }
      linkData.push(data);
    }

    forkJoin([
      this.applicationClusterService.updateList(clusterData),
      this.applicationNodeService.updateList(nodeData),
      this.linkService.updateList(linkData)
    ]).subscribe(() => {
      this.loading = false;
      this.myDiagramComponent.diagram.isReadOnly = true;
      this.isEditing = false;
    }, err => {
      this.loading = false;
      console.log(err);
      this.toastrService.danger('Có lỗi xảy ra. Vui lòng thử lại sau.', 'Lỗi', {icon: 'alert-triangle-outline'});
    });
  }

}
