import {AfterViewInit, Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {LookupTableService} from '../../services/lookup-table.service';
import {NbDialogService, NbToastrService} from '@nebular/theme';
import {TranslateService} from '@ngx-translate/core';
import {ShareDataBreadcrumbService} from '../../services/share-data-breadcrumb.service';
import {Page} from '../../@core/model/page.model';
import {HttpHeaders} from '@angular/common/http';
import * as fileSaver from 'file-saver';
import {FormArray, FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'ngx-lookup-table',
  templateUrl: './lookup-table.component.html',
  styleUrls: ['./lookup-table.component.scss']
})
export class LookupTableComponent implements OnInit {
  @ViewChild('downloadETLF') downloadETLF: TemplateRef<any>;
  @ViewChild('table') table: ElementRef;
  isLoading = false;
  page = new Page();
  formGroupDashboard: any;
  ListStatusDashboard: any;
  checkTypeOrderASC: boolean = true;
  checkTypeOrderDESC: boolean = false;
  isFilerBox: boolean = false;
  valueTypeOrder = 'ASC';
  valueSearch = '';
  valueExactly = 0;
  limits = [5, 10, 15, 20];
  limit = 10;
  dataRow: any;
  rows = [];
  selected = [];
  listFilterSelected = [];
  columnsTable = [
    {name: '', prop: 'selected_row', flexGrow: 0.1},
    {name: 'Stt', prop: 'stt', flexGrow: 0.3},
    {name: 'lookupTable.relationName', prop: 'relationName', flexGrow: 0.8},
    {name: 'lookupTable.jobName', prop: 'jobName', flexGrow: 0.8},
    {name: 'lookupTable.tableName', prop: 'tableName', flexGrow: 0.8},
    {name: 'lookupTable.tableAction', prop: 'tableAction', flexGrow: 0.7},
    {name: 'Relation status', prop: 'jobRelationStatus', flexGrow: 0.5},
    {name: 'lookupTable.jobStatus', prop: 'isPublic', flexGrow: 0.5},
    // {name: 'lookupTable.dateModifyRelation', prop: 'relationModifyDate', flexGrow: 1},
    // {name: 'lookupTable.dateModifyJob', prop: 'jobModifyDate', flexGrow: 0.8},
    {name: 'Action', prop: 'action', flexGrow: 0.6}
  ];
  listColumnTableOder = [{name: 'Relation name', value: 'RELATION_NAME'}, {
    name: 'Job name',
    value: 'JOB_NAME'
  }, {
    name: 'Table name',
    value: 'TABLE_NAME'
  }, {name: 'Date modify relation', value: 'relationModifyDate'}, {
    name: 'Date modify job',
    value: 'jobModifyDate'
  }];
  listStatus = [{name: 'All', value: ''}, {name: 'Enable', value: 1}, {
    name: 'Disable',
    value: '0'
  }];
  listTableAction = [{name: 'create', value: 'create'}, {
    name: 'update',
    value: 'update'
  }, {
    name: 'use',
    value: 'use'
  }, {
    name: 'delete',
    value: 'delete'
  }, {
    name: 'insert',
    value: 'insert'
  }];
  listTypeOrder = [{name: 'ASC', value: 'ASC'}, {name: 'DESC', value: 'DESC'}]
  valueListCriteria = 'RELATION_NAME'
  valueListData = 'RELATION_NAME';
  relationStatus = ''
  jobStatus = ''
  isCheckedTotal = false;
  listFilterForm: FormArray = this.fb.array([]);
  listChangeFilter = [];
  arrayFilter = [];
  listTypeFilter = [
    {name: 'Table action', value: 'tableAction'},
    {name: 'relation status', value: 'relationStatus'},
    {name: 'Job status', value: 'jobStatus'},
  ];
  optionDefault;
  optionChange = {
    tableAction: '',
    relationStatus: '',
    keySearch: '',
    jobStatus: '',
    size: 10,
    page: 0
  }

  constructor(private lookupTableService: LookupTableService, private shareData: ShareDataBreadcrumbService, private fb: FormBuilder, private toastrService: NbToastrService, public translate: TranslateService, public dialogService: NbDialogService) {
    this.page.pageNumber = 0;
    this.page.size = this.limit;
  }

  ngOnInit(): void {
    this.optionDefault = {
      tableAction: '',
      relationStatus: '',
      keySearch: '',
      jobStatus: '',
      size: 10,
      page: 0
    };
    this.sendDataBreadCrumb();
    this.getEtlJobInfos(this.optionDefault);
    this.addRowFilter();
  }

  sendDataBreadCrumb() {
    this.shareData.updateData({
      title: 'Utility',
      groupText: 'ETL Tools',
      titleChild: 'Lookup table',
      urlPage: '/page/lookup-table',
    })
  }

  formatDateCheck(date) {
    if (date) {
      const d = new Date(date);
      let month = '' + (d.getMonth() + 1);
      let day = '' + d.getDate();
      const year = d.getFullYear();
      if (month.length < 2)
        month = '0' + month;
      if (day.length < 2)
        day = '0' + day;

      return [day, month, year].join('/');
    } else {
      return ''
    }
  }

  setPage(pageInfo) {
    this.page.size = this.limit;
    const pageToLoad: number = pageInfo.offset;
    this.isLoading = true;
    const options = {
      tableAction: '',
      relationStatus: '',
      keySearch: '',
      jobStatus: '',
      size: this.page.size,
      page: pageToLoad
    }
    this.lookupTableService.etlJobInfos(options).subscribe((res) => {
      this.dataRow = res.body;
      this.isLoading = false;
      this.onSuccess(res.headers, pageToLoad);
      this.isLoading = false;
    }, (error) => {
      this.toastrService.danger('error', this.translate.instant('toast.note'));
      this.isLoading = false;
    })
  }

  protected onSuccess(headers: HttpHeaders, page: number): void {
    this.isLoading = false;
    this.page.totalElements = Number(headers.get('X-Total-Count'));
    console.log(this.page);
    this.page.pageNumber = page || 0;
  }

  getEtlJobInfos(options) {
    this.isLoading = true;
    this.lookupTableService.etlJobInfos(options).subscribe((res) => {
      this.onSuccess(res.headers, 0)
      this.dataRow = res.body;
      this.isLoading = false;
    }, (error) => {
      this.toastrService.danger('error', this.translate.instant('toast.note'));
      this.isLoading = false;
    })
  }

  typeOrderASC(key: string) {
    this.checkTypeOrderASC = false;
    this.checkTypeOrderDESC = true;
    this.valueTypeOrder = key
  }

  typeOrderDESC(key: string) {
    this.checkTypeOrderASC = true;
    this.checkTypeOrderDESC = false;
    this.valueTypeOrder = key
  }

  exactly(event) {
    if (event.target.checked === true) {
      this.valueExactly = 1;
    } else {
      this.valueExactly = 0;
    }
  }

  searchTable() {
    this.getEtlJobInfos({});
  }

  // ChangerelationStatus() {
  //   this.getEtlJobInfos();
  // }

  onSelect({selected}) {
    this.selected = selected
    console.log(this.selected);
  }

  displayCheck(row) {
    return row.name !== '';
  }

  handleDonwloadJob() {
    this.dialogService.open(this.downloadETLF, {
      context: {title: 'Download Job'},
      closeOnBackdropClick: false,
    })
  }

  downLoadItems(item, ref) {
    const options = {
      listPath: item?.jobPath,
      type: '01'
    }
    this.isLoading = true;
    return this.lookupTableService.downLoadEtlJobList(options).subscribe(res => {
      const blob: any = new Blob([res], {type: 'text/json; charset=utf-8'});
      fileSaver.saveAs(blob, item?.jobPath);
      this.isLoading = false;
      ref.close();
    }, (error) => {
      this.isLoading = false;
    });
  }

  downloadMultiItems(ref) {
    const arrayResole = [];
    this.selected.map(value => {
      arrayResole.push(value?.jobPath)
    });
    const options = {
      listPath: arrayResole.toString(),
      type: '02'
    }
    this.isLoading = true;
    return this.lookupTableService.downLoadEtlJobList(options).subscribe(res => {
      const blob: any = new Blob([res], {type: 'application/zip'});
      fileSaver.saveAs(blob, '');
      this.isLoading = false;
      ref.close()
    }, (error) => {
      this.isLoading = false;
    });
  }

  // filter
  openBoxFiler() {
    this.isFilerBox = !this.isFilerBox;
  }

  addRowFilter() {
    if (this.listFilterForm.value.length <= 3) {
      this.listFilterForm.push(this.fb.group({
        typeFilter: [null, Validators.required],
        keyFilter: ['', Validators.required],
      }));
    }
    this.listChangeFilter = [];
  }

  addRowFilterSelected(i) {
    if (this.listFilterSelected.length <= 3) {
      this.arrayFilter.push(this.listFilterForm.value[0]);
      const options = {
        typeFilter: this.listTypeFilter.filter(v => v.value === this.listFilterForm.value[0].typeFilter)[0]?.name,
        keyFilter: this.listChangeFilter[0].filter(v => v.value === this.listFilterForm.value[0].keyFilter)[0]?.name
      }
      const checkSameItem = this.listFilterSelected.some((item, index) => {
        return options?.typeFilter === item?.typeFilter;
      });
      if (checkSameItem !== true) {
        this.listFilterSelected.push(options);
      }
      this.listFilterForm.at(0).patchValue({
        typeFilter: null,
        keyFilter: null
      });
    }
    this.listChangeFilter = [];
  }

  filterChange(row, index: number) {
    if (row.value.selectedFilter === null) {
      this.listChangeFilter[index] = [];
      this.listFilterForm.at(index).patchValue({
        typeFilter: null,
      });
      this.listChangeFilter = [];
      this.getEtlJobInfos(this.optionDefault);
    } else {
      if (row.value.typeFilter === 'tableAction') {
        this.listChangeFilter[index] = this.listTableAction;
        this.listFilterForm.at(index).patchValue({
          keyFilter: null,
        });
      } else if (row.value.typeFilter === 'relationStatus') {
        this.listChangeFilter[index] = this.listStatus;
        this.listFilterForm.at(index).patchValue({
          keyFilter: null,
        });
      } else {
        this.listChangeFilter[index] = this.listStatus;
        this.listFilterForm.at(index).patchValue({
          keyFilter: null,
        });
      }
    }
  }

  closePupupFilter() {
    this.isFilerBox = false;
    this.listFilterForm = this.fb.array([]);
    this.listFilterForm.push(this.fb.group({
      typeFilter: [null, Validators.required],
      keyFilter: ['', Validators.required],
    }));
    this.listChangeFilter = [];
    this.getEtlJobInfos(this.optionDefault);
    this.arrayFilter = [];
    this.listFilterSelected = [];
    this.valueSearch = '';
    this.optionChange = {
      tableAction: '',
      relationStatus: '',
      keySearch: '',
      jobStatus: '',
      size: 10,
      page: 0
    }
  }

  filterWithValue() {
    this.arrayFilter.map(value => {
      this.optionChange[`${value.typeFilter}`] = value.keyFilter
    });
    console.log(this.optionChange)
    this.getEtlJobInfos(this.optionChange);
  }

  deleteFilterSelected(index: number) {
    this.listFilterSelected = [...this.listFilterSelected].filter((e, indexs) => indexs !== index);
    this.arrayFilter = [...this.arrayFilter].filter((e, indexs) => indexs !== index);
    if (this.listFilterSelected.length === 0) {
      this.getEtlJobInfos(this.optionDefault);
    }
  }

  closePupup() {
    this.isFilerBox = false;
  }
}
