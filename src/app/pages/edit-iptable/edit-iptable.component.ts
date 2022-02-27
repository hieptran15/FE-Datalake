import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {EditIptableService} from '../../services/edit-iptable.service';
import {NbDialogService, NbToastrService} from '@nebular/theme';
import {TranslateService} from '@ngx-translate/core';
import {AuthoritiesConstant} from '../../authorities.constant';
import {ShareDataBreadcrumbService} from '../../services/share-data-breadcrumb.service';

@Component({
  selector: 'ngx-edit-iptable',
  templateUrl: './edit-iptable.component.html',
  styleUrls: ['./edit-iptable.component.scss']
})
export class EditIptableComponent implements OnInit, AfterViewInit {
  @ViewChild('textArea') textArea: any;
  checkKey = 'raw';
  textSearch: string;
  isLoading: boolean = false;
  uiText: any;
  firstPage = 0;
  valueRow = [];
  valueRowCheck = []
  selectRule: any;
  editText: any;
  idText: any;
  ItemIpServer: any;
  ipServerDefault: any;
  textResoleUpdate = [];
  textChange = [];
  limit = 10;
  limits = [5, 10, 15, 20];
  columns = [
    {name: 'Row index', prop: 'stt', flexGrow: 0.5},
    {name: 'ipTable.contentRow', prop: 'moduleName', flexGrow: 1.5},
    {name: 'module.column.action', prop: 'action', flexGrow: 1, center: true}
  ];
  listIpService = []
  listRule = [
    {name: 'INPUT'},
    {name: 'OUTPUT'},
    {name: 'FORWARD'}
  ]
  textCode: any;
  authority = AuthoritiesConstant;
  textAreaHeight = 0;

  constructor(private ipTableServices: EditIptableService, private shareData: ShareDataBreadcrumbService, public dialogService: NbDialogService, private toastrService: NbToastrService, public translate: TranslateService) {
  }

  ngOnInit(): void {
    this.getDoSearchWpServerIp();
    this.sendDataTest();
  }

  ngAfterViewInit() {
    // this.changeHeight(this.textArea?.nativeElement);
  }

  sendDataTest() {
    this.shareData.updateData({
      title: 'Access manager',
      groupText: 'IP Table Manager',
      titleChild: 'Edit Iptable',
      urlPage: '/page/edit-iptable',
    })
  }

  getDoSearchWpServerIp() {
    this.ipTableServices.doSearchWpServerIp({}).subscribe((res) => {
      console.log(res)
      this.listIpService = res.body.results
      this.ipServerDefault = res.body.results[0]
      this.ItemIpServer = this.ipServerDefault
    }, (error) => {
      console.log('error', error)
    }, () => {
      // @ts-ignore
      this.getFindContent()
    })
  }

  checkTab(key: string) {
    this.checkKey = key
    const arraySplit = []
    this.textCode.split('\n').map((x, i) => {
      return arraySplit.push({index: i + 1, value: x})
    })
    this.uiText = arraySplit
    this.valueRowCheck = arraySplit.filter(x => x.value.includes('-A INPUT')).concat(arraySplit.filter(x => x.value.includes('-A OUTPUT'))).concat(arraySplit.filter(x => x.value.includes('-A FORWARD')));
    this.valueRow = this.valueRowCheck
  }

  getFindContent(deleteRef) {
    this.isLoading = true
    const option = {
      ip: this.ItemIpServer.ip,
      userSSH: this.ItemIpServer.userSSH,
      passSSH: this.ItemIpServer.passSSH,
      passRoot: this.ItemIpServer.passRoot
    }
    this.ipTableServices.getFindContent(option).subscribe((res) => {
      if (res.body.responseType === 'SUCCESS') {
        this.isLoading = false
        this.textCode = res.body.results[0]
        const checkText = res.body.results
        const arraySplit = []
        checkText[0].split('\n').map((x, i) => {
          return arraySplit.push({index: i + 1, value: x})
        })
        this.uiText = arraySplit
        this.valueRow = arraySplit.filter(x => x.value.includes('-A INPUT')).concat(arraySplit.filter(x => x.value.includes('-A OUTPUT'))).concat(arraySplit.filter(x => x.value.includes('-A FORWARD')));
        setTimeout(() => {
          this.changeHeight(this.textArea.nativeElement);
        }, 200);
      } else {
        if (res.body.responseType === 'FAIL' && res.body.results[0] === '02') {
          this.toastrService.danger(this.translate.instant('ipTable.checkConnect'), this.translate.instant('success.http.notify'));
        }
        this.textCode = 'N/A ...'
        const arraySplit = []
        this.textCode.split('\n').map((x, i) => {
          return arraySplit.push({index: i + 1, value: x})
        })
        this.uiText = arraySplit
        this.valueRowCheck = arraySplit.filter(x => x.value.includes('-A INPUT')).concat(arraySplit.filter(x => x.value.includes('-A OUTPUT'))).concat(arraySplit.filter(x => x.value.includes('-A FORWARD')));
        this.valueRow = this.valueRowCheck
        this.isLoading = false;
      }
    })
    deleteRef.close()
  }

  b64EncodeUnicode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
      return String.fromCharCode(parseInt(p1, 16))
    }))
  }

  updateTextCode(deleteRef) {
    this.isLoading = true
    const textDecode = this.b64EncodeUnicode(this.textCode)
    deleteRef.close();
    const textChangeString = this.textChange.toString();
    const option = {
      ip: this.ItemIpServer.ip,
      userSSH: this.ItemIpServer.userSSH,
      passSSH: this.ItemIpServer.passSSH,
      passRoot: this.ItemIpServer.passRoot,
      iptable: textDecode,
      indexChange: textChangeString
    }
    this.ipTableServices.updateFileConten(option).subscribe((res) => {
      if (res.body.responseType === 'SUCCESS') {
        this.getFindContent(deleteRef)
        this.toastrService.success(this.translate.instant('toast.note'), this.translate.instant('toast.note'));
        this.textChange = [];
      } else {
        this.toastrService.danger('error', this.translate.instant('toast.note'));
        this.isLoading = false
      }

    }, (error => {
      this.toastrService.danger('error', this.translate.instant('toast.note'));
      deleteRef.close()
      this.isLoading = false
    }))
  }

  edit(res) {
    this.editText = res.value
    this.idText = res.index
  }

  updateTextCodeUi(deleteRef) {
    const textcheck = [...this.uiText];
    let checkChange = false;
    textcheck.map((res) => {
      res.index === this.idText ? res.value = this.editText : res
      checkChange = true
    })
    // @ts-ignore
    if (checkChange === true) {
      this.textChange.push(this.idText)
    }
    console.log(this.textChange);
    this.textResoleUpdate = textcheck
    const arrayValue = textcheck.map((sys) => {
      return sys.value
    })
    this.textCode = arrayValue.join('\n');
    deleteRef.close()
  }

  deleteText(res) {
    this.idText = res.index
  }

  deleteRowText(deleteRef) {
    const textcheck = [...this.uiText]
    const itemResole = textcheck.filter(item => item.index !== this.idText)
    this.textResoleUpdate = itemResole
    const arrayValue = itemResole.map((res) => {
      return res.value
    })
    this.textCode = arrayValue.join('\n')
    this.uiText = itemResole.filter(x => x.value.includes('-A INPUT')).concat(itemResole.filter(x => x.value.includes('-A OUTPUT'))).concat(itemResole.filter(x => x.value.includes('-A FORWARD')))
    const arraySplit = []
    this.textCode.split('\n').map((x, i) => {
      return arraySplit.push({index: i + 1, value: x})
    })
    this.uiText = arraySplit;
    this.valueRow = arraySplit.filter(x => x.value.includes('-A INPUT')).concat(arraySplit.filter(x => x.value.includes('-A OUTPUT'))).concat(arraySplit.filter(x => x.value.includes('-A FORWARD'))).filter(v => {
      if (!this.selectRule) return v.value?.toLowerCase().includes(this.textSearch || '');
      return (v.value?.toLowerCase().indexOf(this.selectRule?.toLowerCase()) !== -1) && v.value?.toLowerCase().includes(this.textSearch || '')
    })
    deleteRef.close();
    this.textAreaHeight -= 22;
  }

  filterRule() {
    if (this.selectRule !== null || this.textSearch !== '') {
      this.valueRow = this.uiText.filter(x => x.value.includes('-A INPUT')).concat(this.uiText.filter(x => x.value.includes('-A OUTPUT'))).concat(this.uiText.filter(x => x.value.includes('-A FORWARD'))).filter(v => {
        if (!this.selectRule) return v.value?.toLowerCase().includes(this.textSearch || '');
        return (v.value?.toLowerCase().indexOf(this.selectRule?.toLowerCase()) !== -1) && v.value?.toLowerCase().includes(this.textSearch || '')
      })
      this.firstPage = 0
    } else {
      this.valueRow = this.uiText.filter(x => x.value.includes('-A INPUT')).concat(this.uiText.filter(x => x.value.includes('-A OUTPUT'))).concat(this.uiText.filter(x => x.value.includes('-A FORWARD')));
      this.firstPage = 0
    }
  }

  dulicated(res) {
    this.idText = res.index
  }

  RowDulicated(deleteRef) {
    const textcheck = [...this.uiText]
    const itemResole = textcheck.filter(x => x.index === this.idText)
    textcheck.splice(this.idText - 1, 0, ...itemResole)
    const arrayValue = textcheck.map((res) => {
      return res.value
    })
    this.textCode = arrayValue.join('\n')
    const arraySplit = []
    this.textCode.split('\n').map((x, i) => {
      return arraySplit.push({index: i + 1, value: x})
    })
    this.uiText = arraySplit
    this.valueRow = arraySplit.filter(x => x.value.includes('-A INPUT')).concat(arraySplit.filter(x => x.value.includes('-A OUTPUT'))).concat(arraySplit.filter(x => x.value.includes('-A FORWARD'))).filter(v => {
      if (!this.selectRule) return v.value?.toLowerCase().includes(this.textSearch || '');
      return (v.value?.toLowerCase().indexOf(this.selectRule?.toLowerCase()) !== -1) && v.value?.toLowerCase().includes(this.textSearch || '')
    })
    deleteRef.close()
    this.textAreaHeight += 22;
  }

  loadIpServer() {
    if (this.ItemIpServer !== null) {
      // @ts-ignore
      this.getFindContent()
    } else {
      this.ItemIpServer = this.ipServerDefault
      // @ts-ignore
      this.getFindContent()
    }
  }

  onRowReorder(event): void {
    const movedItem = this.valueRow[event.dropIndex];
    const movedItemNeighbor = this.valueRow[event.dropIndex - 1];
    this.uiText.splice(movedItemNeighbor ? movedItemNeighbor.index : this.valueRow[1].index - 1, 0, movedItem);
    this.uiText.splice(event.dropIndex > event.dragIndex ? movedItem.index - 1 : movedItem.index, 1);
    this.uiText.map((item, index) => item.index = index + 1);
    this.valueRow = this.uiText.filter(x => x.value.includes('-A INPUT')).concat(this.uiText.filter(x => x.value.includes('-A OUTPUT'))).concat(this.uiText.filter(x => x.value.includes('-A FORWARD'))).filter(v => {
      if (!this.selectRule) return v.value?.toLowerCase().includes(this.textSearch || '');
      return (v.value?.toLowerCase().indexOf(this.selectRule?.toLowerCase()) !== -1) && v.value?.toLowerCase().includes(this.textSearch || '')
    });
    const arrayValue = this.uiText.map(res => {
      return res.value
    });
    this.textCode = arrayValue.join('\n');
  }

  changeHeight(element: any) {
    this.textAreaHeight = element.scrollHeight;
    const arraySplit = []
    this.textCode.split('\n').map((x, i) => {
      return arraySplit.push({index: i + 1, value: x})
    })
    this.uiText = arraySplit
  }
}
