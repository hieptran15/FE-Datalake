import {Component, ElementRef, OnInit, TemplateRef, ViewChild, ViewChildren} from '@angular/core';
import {HdfsService} from '../../@core/mock/hdfs.service';
import {ICluster} from '../../@core/model/cluster.model';
import {IHdfs} from '../../@core/model/hdfs.model';
import {NbDialogService, NbPopoverDirective, NbToastrService} from '@nebular/theme';
import {of} from 'rxjs';
import {AuthoritiesConstant} from '../../authorities.constant';
import {PopupErrorComponent} from '../popup-error/popup-error.component';
import {TranslateService} from '@ngx-translate/core';
import {FormBuilder, Validators} from '@angular/forms';
import {ShareDataBreadcrumbService} from '../../services/share-data-breadcrumb.service';

@Component({
    selector: 'ngx-hdfs-browser',
    templateUrl: './hdfs-browser.component.html',
    styleUrls: ['./hdfs-browser.component.scss']
})
export class HdfsBrowserComponent implements OnInit {
    @ViewChildren(NbPopoverDirective) popover: NbPopoverDirective;
    @ViewChild('search') search: ElementRef;
    @ViewChild('inputDesPath') inputDesPath: ElementRef;
    @ViewChild('desPathFile') desPathFile: ElementRef;
    @ViewChild('desPathFolder') desPathFolder: ElementRef;
    @ViewChild('error') errorGetsize: TemplateRef<any>;
    authoritiesConstant = AuthoritiesConstant
    tableOffset = 0;
    isLoading = true;
    checkUserHdfs: boolean = false;
    fileName: string;
    fileContent: string;
    confirmationString: string;
    confirmationText: string;
    selectedCluster: string;
    selectedPopupCluster: string;
    tempPermission: string;
    selectedHdfsUser: string;
    listUserHdfs = [];
    selectedKeys: any[] = [];
    hdfs: IHdfs[];
    tempHdfs: IHdfs[];
    folderTree: IHdfs[];
    clusters: ICluster[];
    breadcrumb = [{name: 'Root', path: '/'}];
    path: string;
    destinationPath = '/';
    pathBreadcrumb = '/';
    defaultPathBre = '';
    folderName = '';
    selectedFolder: any;
    limits = [5, 10, 15, 20];
    limit = 10;
    columns = [
        {name: 'HDFSBrowser.column.permission', prop: 'permission', flexGrow: 0.7},
        {name: 'HDFSBrowser.column.owner', prop: 'owner', flexGrow: 0.8},
        {name: 'HDFSBrowser.column.group', prop: 'group', flexGrow: 0.8},
        {name: 'HDFSBrowser.column.size', prop: 'size', flexGrow: 0.6},
        {name: 'HDFSBrowser.column.quota', prop: 'quota', flexGrow: 0.6},
        {name: 'HDFSBrowser.column.replication', prop: 'block_replication', flexGrow: 0.8},
        {name: 'HDFSBrowser.column.blockSize', prop: 'blocksize', flexGrow: 0.8},
        {name: 'HDFSBrowser.column.name', prop: 'path', flexGrow: 0.8},
        {name: 'HDFSBrowser.column.option', prop: 'actions', flexGrow: 0.5}
    ];
    formGroup = this.fb.group({
        userHdfsId: [null],
        RoleGroup: [null],
        listDPermission: [null, Validators.required]
    });

    constructor(
        private fb: FormBuilder,
        private shareData: ShareDataBreadcrumbService,
        private hdfsService: HdfsService,
        private toastrService: NbToastrService,
        public dialogService: NbDialogService,
        private translate: TranslateService,
    ) {
    }

    ngOnInit(): void {
        this.sendDataTest();
        this.getUserHdfs();
        this.isLoading = true;
        this.hdfsService.getClusters().subscribe(res => {
            if (res.body.responseType === 'SUCCESS') {
                this.clusters = res.body.results;
                this.selectedCluster = this.clusters[0].hdfsAddress;
                this.selectedPopupCluster = this.clusters[0].hdfsAddress;
                this.isLoading = false;
                this.getHdfs();
                this.getSubFolder('');
                // this.getUserHdfs();
            } else {
                this.isLoading = false;
                this.dialogService.open(PopupErrorComponent, {
                    context: {error: res.body.message},
                    closeOnEsc: false,
                    closeOnBackdropClick: false
                })
            }
        }, error => {
            this.isLoading = false;
            this.dialogService.open(PopupErrorComponent, {
                context: {error: error.error.message},
                closeOnEsc: false,
                closeOnBackdropClick: false
            })
        });
    }

    sendDataTest() {
        this.shareData.updateData({
            title: 'Utility',
            groupText: 'HDFS Tools',
            titleChild: 'HDFS browser',
            urlPage: '/page/hdfs-browser',
        })
    }

    // ngAfterViewInit(): void {
    //   fromEvent(this.search.nativeElement, 'keyup')
    //     .pipe(debounceTime(550), map(x => x['target']['value']))
    //     .subscribe(value => {
    //       if (value.substr(0, 1) !== '/') {
    //         this.updateFilter(value);
    //       } else {
    //         this.getHdfs(value);
    //       }
    //     });
    // }

    children = (dataItem) => {
        return of(dataItem.children)
    };

    hasChildren = (dataItem: any) => {
        return dataItem.children && dataItem.children.length > 0;
    };

    isDisabled = (dataItem: any) => {
        return !dataItem.isdir;
    };

    getUserHdfs() {
        this.hdfsService.getUserHdfs().subscribe(res => {
            console.log(res)
            if (res.body.responseType === 'SUCCESS') {
                this.listUserHdfs = res.body?.results;
                if (res.body?.results.length === 0) {
                    this.checkUserHdfs = true;
                    this.selectedHdfsUser = '';
                } else {
                    this.checkUserHdfs = false;
                    this.selectedHdfsUser = res.body.results[0].hdfsUser;
                }
            } else {
                this.isLoading = false;
            }
        }, error => {
            this.isLoading = false;
        })
    }

    getHdfs(path?: string, resetBreadcrumb?: boolean) {
        this.hdfs = [];
        this.isLoading = true;
        let searchPath = '';
        if (path) {
            searchPath = path.startsWith('/') ? path.replace('/', '') : path;
        }
        this.hdfsService.getHdfsByPath(this.selectedCluster, searchPath).subscribe(res => {
            if (res.body.responseType === 'SUCCESS') {
                this.tempHdfs = res.body.results;
                this.tempHdfs.map(item => item.isLoading = false);
                this.hdfs = this.tempHdfs;
                this.isLoading = false;
                // this.search.nativeElement.value = '';
                this.tableOffset = 0;
                if (resetBreadcrumb) {
                    this.breadcrumb = [{name: 'Root', path: '/'}];
                }
            } else {
                this.isLoading = false;
                this.dialogService.open(PopupErrorComponent, {
                    context: {error: res.body.message},
                    closeOnEsc: false,
                    closeOnBackdropClick: false
                })
            }
        }, error => {
            this.isLoading = false;
            this.dialogService.open(PopupErrorComponent, {
                context: {error: error.error.message},
                closeOnEsc: false,
                closeOnBackdropClick: false
            })
        });
    }

    getTreeData() {
        this.selectedKeys = [];
        this.hdfsService.getHdfsByPath(this.selectedCluster, '').subscribe(res => {
            if (res.body.responseType === 'SUCCESS') {
                this.folderTree = res.body.results;
            } else {
                this.isLoading = false;
                this.dialogService.open(PopupErrorComponent, {
                    context: {error: res.body.message},
                    closeOnEsc: false,
                    closeOnBackdropClick: false
                })
            }
        }, error => {
            this.isLoading = false;
            this.dialogService.open(PopupErrorComponent, {
                context: {error: error.error.message},
                closeOnEsc: false,
                closeOnBackdropClick: false
            })
        });
    }

    getSubFolder(path: string, event?) {
        this.destinationPath = '';
        if (this.folderTree && this.selectedKeys) {
            this.buildPath(this.folderTree, this.selectedKeys.toString());
        }
        if (this.destinationPath && this.destinationPath[0] === '/') {
            this.destinationPath = this.destinationPath.replace('/', '');
            this.pathBreadcrumb = '/' + this.destinationPath;
        }
        this.hdfsService.getHdfsByPath(this.selectedCluster, this.destinationPath).subscribe(res => {
            if (res.body.responseType === 'SUCCESS') {
                if (event) {
                    if (!event['dataItem']['children']) {
                        event['dataItem']['children'] = [];
                    }
                    event['dataItem']['children'] = res.body.results;
                } else {
                    this.folderTree = res.body.results;
                }
            } else {
                this.isLoading = false;
                this.dialogService.open(PopupErrorComponent, {
                    context: {error: res.body.message},
                    closeOnEsc: false,
                    closeOnBackdropClick: false
                })
            }
        }, error => {
            this.isLoading = false;
            this.dialogService.open(PopupErrorComponent, {
                context: {error: error.error.message},
                closeOnEsc: false,
                closeOnBackdropClick: false
            })
        });
    }

    getFolderName(fullPath: string): string {
        const pathParts = fullPath.split('/');
        return pathParts[pathParts.length - 1];
        /*if (fullPath.indexOf('hdfs://') !== -1) {
          return fullPath.replace(`hdfs://${this.selectedCluster}/app-logs`, '');
        } else {
          return fullPath.replace(this.selectedCluster, '');
        }*/
    }

    /*  copyToClipboard(input: any) {
        const path = [];
        this.breadcrumb.forEach(item => {
          if (item.path !== '/') {
            path.push(item.path);
          }
        });
        // this.copyText(path);
        console.log(path)
      }*/

    onPathClick(value: string) {
        const folder = this.getFolderName(value);
        const path = [];
        this.breadcrumb.push({name: folder, path: folder});
        this.breadcrumb.forEach(item => {
            if (item.path !== '/') {
                path.push(item.path);
            }
        });
        this.pathBreadcrumb = path ? `/${path.join('/')}` : '/';
        this.defaultPathBre = path ? `/${path.join('/')}` : '/';
        this.getHdfs(path.join('/'));
    }

    onBreadcrumbClick(i) {
        const path = [];
        this.breadcrumb.splice(i + 1, this.breadcrumb.length - i);
        this.breadcrumb.forEach(item => {
            if (item.path !== '/') {
                path.push(item.path);
            }
        });
        this.pathBreadcrumb = path ? `/${path.join('/')}` : '/';
        this.defaultPathBre = path ? `/${path.join('/')}` : '/';
        this.getHdfs(path.join('/'));
    }

    convertSize(size: number) {
        if (size === -1) {
            return 'none'
        } else {

            return size >= 1073741824 ? Math.round(((size / 1073741824) + Number.EPSILON) * 100) / 100 + ' GB' : size >= 1048576 ? Math.round(((size / 1048576) + Number.EPSILON) * 100) / 100 + ' MB' : size >= 1024 ? Math.round(((size / 1024) + Number.EPSILON) * 100) / 100 + ' KB' : size + ' Bytes';

        }

    }

    getSize(index: number) {
        this.hdfs[index].isLoading = true;
        this.isLoading = true
        const path = [];
        this.breadcrumb.forEach(item => {
                if (item.path !== '/') {
                    path.push(item.path);
                }
            }
        );
        const src = path.length > 0 ? `/${path.join('/')}/${this.getFolderName(this.hdfs[index].path)}` : `${path.join('/')}/${this.getFolderName(this.hdfs[index].path)}`;
        // this.hdfsService.getSize(this.selectedCluster, 'hdfs', src).subscribe(res => {
        this.hdfsService.getSize(this.selectedCluster, this.selectedHdfsUser, src).subscribe(res => {
            if (res.body.responseType === 'SUCCESS') {
                this.hdfs[index].size = res.body.results[0]['size'];
                this.hdfs[index].isLoading = false;
                this.hdfs = [...this.hdfs];
                this.isLoading = false;
            } else {
                this.isLoading = true;
                setTimeout(() => this.isLoading = false, 10000);
                this.dialogService.open(this.errorGetsize, {
                    context: {data: res.body.message},
                    closeOnEsc: true,
                    hasBackdrop: true
                })
            }
        }, error => {
            this.isLoading = true;
            setTimeout(() => this.isLoading = false, 10000);
            this.dialogService.open(this.errorGetsize, {
                context: {data: this.translate.instant('HDFSBrowser.label.errorConnection')},
                closeOnEsc: true,
                hasBackdrop: true
            })
        });
        // this.hdfsService.getQuota(this.selectedCluster, 'hdfs', src).subscribe(res => {
        this.hdfsService.getQuota(this.selectedCluster, this.selectedHdfsUser, src).subscribe(res => {
            if (res.body.responseType === 'SUCCESS') {
                this.hdfs[index].quota = res.body.results[0]['spaceQuota'];
                this.hdfs[index].isLoading = false;
                this.hdfs = [...this.hdfs];
            } else {
                this.isLoading = false;
                this.dialogService.open(PopupErrorComponent, {
                    context: {error: res.body.message},
                    closeOnEsc: false,
                    closeOnBackdropClick: false
                })
            }
        }, error => {
            this.isLoading = false;
            this.dialogService.open(PopupErrorComponent, {
                context: {error: error.error.message},
                closeOnEsc: false,
                closeOnBackdropClick: false
            })
        });
    }

    delete(pathTail: string, ref: any) {
        const path = [];
        this.breadcrumb.forEach(item => {
            if (item.path !== '/') {
                path.push(item.path);
            }
        });
        const src = path.length > 0 ? `/${path.join('/')}/${pathTail}` : `${path.join('/')}/${pathTail}`;
        this.hdfsService.delete(this.selectedCluster, src).subscribe(res => {
            if (res.body.responseType === 'SUCCESS') {
                this.getHdfs(path.join('/'));
                ref.close();
                this.isLoading = false;
                this.toastrService.show(this.translate.instant('success.http.actionSuccessfully'), this.translate.instant('success.http.notify'), {status: 'success'});
            } else {
                this.isLoading = false;
                this.dialogService.open(PopupErrorComponent, {
                    context: {error: res.body.message},
                    closeOnEsc: false,
                    closeOnBackdropClick: false
                })
            }
        }, error => {
            this.isLoading = false;
            this.dialogService.open(PopupErrorComponent, {
                context: {error: error.error.message},
                closeOnEsc: false,
                closeOnBackdropClick: false
            })
        });
    }

    newFile(ref) {
        /*chuyen den thu muc despath khi thanh cong*/
        this.breadcrumb = [{name: 'Root', path: '/'}];
        const valArr = this.desPathFile.nativeElement.value.split('/');
        valArr.shift()
        valArr.forEach(element => {
            const folder = this.getFolderName(element);
            const path = [];
            this.breadcrumb.push({name: folder, path: folder});
            this.breadcrumb.forEach(item => {
                if (item.path !== '/') {
                    path.push(item.path);
                    this.pathBreadcrumb = path ? `/${path.join('/')}` : '/';
                }
            });
        });
        this.hdfsService.newFile(this.selectedCluster, this.desPathFile.nativeElement.value, this.fileName, this.fileContent).subscribe(res => {
            if (res.body.responseType === 'SUCCESS') {
                this.getHdfs(this.desPathFile.nativeElement.value);
                this.fileName = '';
                this.fileContent = '';
                ref.close();
                this.toastrService.show(this.translate.instant('success.http.actionSuccessfully'), this.translate.instant('success.http.notify'), {status: 'success'});
            } else {
                this.isLoading = false;
                this.dialogService.open(PopupErrorComponent, {
                    context: {error: res.body.message},
                    closeOnEsc: false,
                    closeOnBackdropClick: false
                })
            }
        }, error => {
            this.isLoading = false;
            this.dialogService.open(PopupErrorComponent, {
                context: {error: error.error.message},
                closeOnEsc: false,
                closeOnBackdropClick: false
            })
        });
    }

    newMoveCopy(type: string, srcPath: string, ref: any) {
        this.pathBreadcrumb = this.defaultPathBre;
        const path = [];
        let desPathFolder;
        this.desPathFolder ? desPathFolder = this.desPathFolder.nativeElement.value : desPathFolder = '';
        let desPathMoveCopy
        this.inputDesPath ? desPathMoveCopy = this.inputDesPath.nativeElement.value : desPathMoveCopy = '';
        this.breadcrumb.forEach(item => {
            if (item.path !== '/') {
                path.push(item.path);
            }
        });
        /*chuyen den thu muc despath khi thanh cong*/
        let valArr;
        type === 'new-folder' ? valArr = desPathFolder.split('/') : valArr = desPathMoveCopy.split('/');
        this.breadcrumb = [{name: 'Root', path: '/'}];
        valArr.shift()
        valArr.forEach(element => {
            const folder = this.getFolderName(element);
            const path1 = [];
            this.breadcrumb.push({name: folder, path: folder});
            this.breadcrumb.forEach(item => {
                if (item.path !== '/') {
                    path1.push(item.path);
                    this.pathBreadcrumb = path1 ? `/${path1.join('/')}` : '/';
                }
            });
        });
        switch (type) {
            case 'new-folder':
                this.hdfsService.newFolder(this.selectedCluster, this.folderName, this.desPathFolder.nativeElement.value).subscribe(res => {
                    if (res.body.responseType === 'SUCCESS') {
                        this.getHdfs(desPathFolder)
                        ref.close();
                        // this.selectedPopupCl uster = this.clusters[0].hdfsAddress;
                        this.toastrService.show(this.translate.instant('success.http.actionSuccessfully'), this.translate.instant('success.http.notify'), {status: 'success'});
                    } else {
                        this.isLoading = false;
                        this.dialogService.open(PopupErrorComponent, {
                            context: {error: res.body.message},
                            closeOnEsc: false,
                            closeOnBackdropClick: false
                        })
                    }
                }, error => {
                    this.isLoading = false;
                    this.dialogService.open(PopupErrorComponent, {
                        context: {error: error.error.message},
                        closeOnEsc: false,
                        closeOnBackdropClick: false
                    })
                });
                break;
            case 'move':
                const src = path.length > 0 ? `/${path.join('/')}/${this.getFolderName(srcPath)}` : `${path.join('/')}/${this.getFolderName(srcPath)}`;
                this.buildPath(this.folderTree, this.selectedKeys.toString());
                this.hdfsService.moveTo(this.selectedCluster, src, this.inputDesPath.nativeElement.value).subscribe(res => {
                    if (res.body.responseType === 'SUCCESS') {
                        this.getHdfs(desPathMoveCopy);
                        ref.close();
                        // this.selectedPopupCluster = this.clusters[0].hdfsAddress;
                        this.toastrService.show(this.translate.instant('success.http.actionSuccessfully'), 'Notification', {status: 'success'});
                    } else {
                        this.isLoading = false;
                        this.dialogService.open(PopupErrorComponent, {
                            context: {error: res.body.message},
                            closeOnEsc: false,
                            closeOnBackdropClick: false
                        })
                    }
                }, error => {
                    this.isLoading = false;
                    this.dialogService.open(PopupErrorComponent, {
                        context: {error: error.error.message},
                        closeOnEsc: false,
                        closeOnBackdropClick: false
                    })
                });
                break;
            case 'copy':
                this.destinationPath = '';
                const src1 = path.length > 0 ? `/${path.join('/')}/${this.getFolderName(srcPath)}` : `${path.join('/')}/${this.getFolderName(srcPath)}`;
                this.buildPath(this.folderTree, this.selectedKeys.toString());
                this.hdfsService.copyTo(this.selectedCluster, src1, `${this.inputDesPath.nativeElement.value}/${this.getFolderName(srcPath)}`).subscribe(res => {
                    if (res.body.responseType === 'SUCCESS') {
                        this.getHdfs(desPathMoveCopy);
                        ref.close();
                        // this.selectedPopupCluster = this.clusters[0].hdfsAddress;
                        this.toastrService.show(this.translate.instant('success.http.actionSuccessfully'), this.translate.instant('success.http.notify'), {status: 'success'});
                    } else {
                        this.isLoading = false;
                        this.dialogService.open(PopupErrorComponent, {
                            context: {error: res.body.message},
                            closeOnEsc: false,
                            closeOnBackdropClick: false
                        })
                    }
                }, error => {
                    this.isLoading = false;
                    this.dialogService.open(PopupErrorComponent, {
                        context: {error: error.error.message},
                        closeOnEsc: false,
                        closeOnBackdropClick: false
                    })
                });
                break;
        }
    }

    changePermission(i: number, ref: any) {
        const hdfsItem = this.hdfs[i];
        const pathTail = this.getFolderName(this.hdfs[i].path);
        let chModCode = '';
        let chModCodeTemp = '';
        const path = [];
        this.breadcrumb.forEach(item => {
            if (item.path !== '/') {
                path.push(item.path);
            }
        });
        this.tempPermission.split('').forEach((char, index) => {
            if (index !== 0 && index % 3 === 0) {
                chModCodeTemp = ''
            }
            switch (char) {
                case 'r':
                    chModCodeTemp = `${chModCodeTemp}4`;
                    break;
                case 'w':
                    chModCodeTemp = `${chModCodeTemp}2`;
                    break;
                case 'x':
                    chModCodeTemp = `${chModCodeTemp}1`;
                    break;
                default:
                    chModCodeTemp = `${chModCodeTemp}0`;
                    break;
            }
            if (index === 2 || index === 5 || index === 8) {
                let tempNumber = 0;
                chModCodeTemp.split('').forEach(tempChar => {
                    tempNumber += parseInt(tempChar, 10);
                });
                chModCode = `${chModCode}${tempNumber.toString()}`
            }
        });
        const src = path.length > 0 ? `/${path.join('/')}/${pathTail}` : `${path.join('/')}/${pathTail}`;
        this.hdfsService.changePermission(hdfsItem.path.replace('hdfs://', '').split('/')[0], src, chModCode).subscribe(res => {
            if (res.body.responseType === 'SUCCESS') {
                this.tempPermission = '';
                this.getHdfs(path.join('/'));
                ref.close();
                this.toastrService.show(this.translate.instant('success.http.actionSuccessfully'), this.translate.instant('success.http.notify'), {status: 'success'});
            } else {
                this.isLoading = false;
                this.dialogService.open(PopupErrorComponent, {
                    context: {error: res.body.message},
                    closeOnEsc: false,
                    closeOnBackdropClick: false
                })
            }
        }, error => {
            this.isLoading = false;
            this.dialogService.open(PopupErrorComponent, {
                context: {error: error.error.message},
                closeOnEsc: false,
                closeOnBackdropClick: false
            })
        });
    }

    buildPath(arr: any[], indexStr: string) {
        const indexes = indexStr.split('_');
        const children = arr[indexes[0]]['children'];
        this.destinationPath += `/${this.getFolderName(arr[indexes[0]]['path'])}`;
        indexes.splice(0, 1);
        if (children && indexes.length > 0) {
            this.buildPath(children, indexes.join('_'));
        }
    }

    makeId(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        this.confirmationString = result;
    }

    replaceChar(origString, replaceChar, index) {
        const firstPart = origString.substr(0, index);
        const lastPart = origString.substr(index + 1);
        this.tempPermission = firstPart + replaceChar + lastPart;
    }

    updateFilter(val: any) {
        if ((val.substr(0, 1) !== '/')) {
            const value = val.toString().toLowerCase().trim();
            const count = this.columns.length;
            const keys = Object.keys(this.tempHdfs[0]);
            this.hdfs = this.tempHdfs.filter(item => {
                for (let i = 0; i < count; i++) {
                    if ((item[keys[i]] && item[keys[i]].toString().toLowerCase().indexOf(value) !== -1) || !value) {
                        return true;
                    }
                }
            });
        } else {
            if (val === '/') {
                this.breadcrumb = [{name: 'Root', path: '/'}];
                this.pathBreadcrumb = val;
                this.getHdfs('/');
            } else {
                this.breadcrumb = [{name: 'Root', path: '/'}];
                this.getHdfs(val);
                const valArr = val.split('/');
                valArr.shift()
                valArr.forEach(element => {
                    const folder = this.getFolderName(element);
                    const path = [];
                    this.breadcrumb.push({name: folder, path: folder});
                    this.breadcrumb.forEach(item => {
                        if (item.path !== '/') {
                            path.push(item.path);
                            this.pathBreadcrumb = path ? `/${path.join('/')}` : '/';
                        }
                    });
                });
            }
        }
    }

    onPageChange(event: any): void {
        this.tableOffset = event.offset;
    }

    copyText(val: string) {
        const selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '1';
        selBox.value = val;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);
    }

    hidePopup() {
        if (!this.popover) {
            return
        }
        // @ts-ignore
        for (const popup of this.popover) {
            popup.hide();
        }
    }

    // getIndex() {
    //   de
    // }
}
