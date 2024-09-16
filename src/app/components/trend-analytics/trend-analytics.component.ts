import { GenericLocalStorage } from './../../helpers/generic-local-storage';
import { ValidationModal } from './../../helpers/validation-modal';
import { Encoder } from './../../services/encoder';
import { Component, OnInit } from '@angular/core';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
// import * as d3 from 'd3-shape';
import htmlToImage from 'html-to-image';
import { Converter } from 'src/app/helpers/converter';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { HttpService } from 'src/app/services/http.service';
import { GenericDomainProductFamily } from 'src/app/services/GenericDomainProductFamily';

@Component({
  selector: 'app-trend-analytics',
  templateUrl: './trend-analytics.component.html',
  styleUrls: ['./trend-analytics.component.css']
})

export class TrendAnalyticsComponent implements OnInit {
  faDownload = faDownload;

  /**variables starts here */

  // review period variables
  productList: any;
  quarterList: any;

  typeList: any;
  // view: any = [800, 300];
  reviewData: any;
  productEventData: any;
  // colorScheme: any = [];
  data: any;
  datatest: any;
  item: any;

  showBar: any;
  showLine: any;
  showArea; any;
  selectedP: any;
  selectedProduct: any = [];
  selectedQ1: any;
  selectedQ2: any;
  selectedT: any;
  selectedC: any;
  selectedCp: any;
  chartTypes: any = [];
  chartTypes1: any = [];

  // curve: any = d3.curveBasis;
  // view: any[] = [0, 0];
  // view2: any[] = [0, 0];
  maxXAxisTickLength = 5;
  // options
  showXAxis = true;
  showYAxis = true;
  gradient = true;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Product';
  showYAxisLabel = true;
  yAxisLabel = 'Signal Count';
  legendTitle = 'Period';

  colorScheme = {
    domain: ['#265690', '#eb5627', '#80610b', '#7aa3e5', '#80610b', '#AAAAAA']
  };
  colorScheme1 = {
    domain: ['#265690', '#eb5627', '#7aa3e5', '#269990', '#302290', '#80610b', '#80610b', '#AAAAAA']
  };
  selectedPE: any;
  showParameters: any;
  signals: any = [];
  result: any = [];
  pecColor = {
    domain: ['#E8941B', '#BFBFBF', '#50496E', '#C068A8']
  };
  show: boolean;
  AllProd: boolean;
  columnChart: boolean;
  stackedBar: boolean;
  stackedChart: boolean;
  Q12020: boolean;
  Q22020: boolean;
  single: { name: string; value: number; }[];
  productTypes: any = [];
  productType: any;
  selectedproductType: any;
  selectedPeriod: any;
  detecteddata: any;
  validateddata: any;
  /**variables ends here */
  var1: any;
  selected5Values: string[];
  showdata1: any; // { name: string; series: { name: string; value: number; }[]; }[];
  multiselectedproduct: string;
  quarterselected: string;
  productFamily: { id: number; name: string; }[];
  selectProductFamily: any;
  selectedfamily: boolean;
  showcompare: any;
  showcompare1: any[];
  showcul: any[];
  detecteddata1: any;

  constructor(private httpService: HttpService,
     private converter: Converter,
     private encodeValue: Encoder,
     private prodFamily: GenericDomainProductFamily,
     private localStorage: GenericLocalStorage,
     private ngxLoader: NgxUiLoaderService,
     private validationModal: ValidationModal) {}

  ngOnInit(): void {
    this.productFamily = this.prodFamily.selectProductFamilyType();
   // this.selectProductFamily = this.productFamily[0];
    this.getAvailable_Quarters();
    this.getProductTypes();
    // (localStorage.getItem('dsdomainname'));
    //this.selectedproductType = 'Drug';
   // this.selectProductconsole.logFamily =localStorage.getItem('dsproductfamily')==null ?this.productFamily[0]: localStorage.getItem('dsproductfamily') ;
    this.selectedproductType = localStorage.getItem('dsdomainname')==null ?'Drug' : localStorage.getItem('dsdomainname');
    this.selectProductFamily =localStorage.getItem('dsproductfamily')==null ?this.productFamily[0]: localStorage.getItem('dsproductfamily') ;
    this.selectedProduct= JSON.parse(this.localStorage.getItemRObjects('dsProductdropdown'));
    this.multiselectedproduct=localStorage.getItem('dsProductvalue');
    if (this.selectProductFamily.name === 'Individual Product' || this.selectProductFamily === 'Individual Product') {
      this.selectedfamily = false;
    } else {
      this.selectedfamily = true;
    }
    this.selectedPeriod=JSON.parse(this.localStorage.getItemRObjects('dsQuarterdropdown'));
    this.quarterselected=localStorage.getItem('dsQuartervalue');
    this.onChangedropdown('First', 'First');
    this.showBar = true;
    this.showLine = false;
    this.showArea = false;
  }

  /**Method called on change of products & quarters */
  onChangedropdown(ngmodelvalue: any, selectedvaluefromdropdown: any) {
    // console.log('dropdown-data: ', ngmodelvalue, selectedvaluefromdropdown);
    // this.checkItemsLength(ngmodelvalue);
    // return;
    this.ngxLoader.start();
    //console.log(this.selectProductFamily,this.selectProductFamily.name)
    if (this.selectProductFamily.name === 'Individual Product' || this.selectProductFamily === 'Individual Product') {
      this.selectedfamily = false;
    } else {
      this.selectedfamily = true;
    }
    if (selectedvaluefromdropdown === 'domain') {
      this.localStorage.saveItem('dsdomainname', this.selectedproductType.name ? this.selectedproductType.name : this.selectedproductType);

      this.selectedProduct = [];
      //this.selectedPeriod = ['Current'];
      this.selectedPeriod= [{ name : "Current" }] ;
      this.quarterselected = 'Current';

      this.multiselectedproduct = '';
      this.quarterselected = '';
      this.getProducts(this.selectedproductType.name ? this.selectedproductType.name : this.selectedproductType, this.selectedfamily );
      this.localStorage.deleteItem('dsEventvalue');
      this.localStorage.deleteItem('dsEventdropdown');
      this.localStorage.deleteItem('dsProductvalue');
      this.localStorage.deleteItem('dsProductdropdown');
      this.localStorage.saveItem('dsQuartervalue',this.quarterselected);
      this.localStorage.saveObject('dsQuarterdropdown', [{ name : "Current" }]);
    }
    if (selectedvaluefromdropdown === 'ProductFamily') {
      //console.log("------------",this.selectProductFamily.name);
      this.localStorage.saveItem('dsproductfamily',this.selectProductFamily.name);

      this.selectedProduct = [];
      this.multiselectedproduct = '';
     // this.selectedPeriod = ['Current'];
      this.selectedPeriod= [{ name : "Current" }] ;
      this.quarterselected = 'Current';
    //  this.quarterselected = '';
      this.getProducts(this.selectedproductType.name ? this.selectedproductType.name : this.selectedproductType, this.selectedfamily );

      // this.selectedProduct = [];
      // this.placeholderPTName = 'Signal PT name';
      // this.selectedS = '';
      // this.selectedPeriod = '';
      // this.quarterselected = 'All';
      // this.multiselectedproduct = 'All';
      // this.seletedpt = 'All';

      // tslint:disable-next-line: max-line-length
      // this.httpService.GetEventsByProduct(this.domainname, this.selectedfamily,this.multiselectedproduct).subscribe((productsevents: any) => {
      //   // this.single = types.data;;
      //   this.signals = productsevents.data;
      //   this.noOfPTbyproduct = productsevents.data.length;

      // });
      // this.httpService.GetProductsByEvent(this.domainname,this.selectedfamily, this.seletedpt).subscribe((eventsproduct: any) => {
      //   // this.single = types.data;;
      //   this.productList = eventsproduct.data;
      //   if (this.selectedProduct.length < 1) {
      //     this.noOfProductbyEvent = eventsproduct.data.length;
      //   }

      // });
      this.localStorage.deleteItem('dsEventvalue');
      this.localStorage.deleteItem('dsEventdropdown');
      this.localStorage.deleteItem('dsProductvalue');
      this.localStorage.deleteItem('dsProductdropdown');
      this.localStorage.saveItem('dsQuartervalue',this.quarterselected);
      this.localStorage.saveObject('dsQuarterdropdown', [{ name : "Current" }]);
    }
    if (selectedvaluefromdropdown === 'product') {
      ngmodelvalue = ngmodelvalue ? ngmodelvalue : 'All';
    }
    // tslint:disable-next-line: triple-equals
    if (ngmodelvalue == 'First') {
     // this.multiselectedproduct = '';
      //this.quarterselected = '';

    }
    if (selectedvaluefromdropdown === 'product') {
      if (ngmodelvalue.length < 1) {
        this.multiselectedproduct = 'ALL';
        this.localStorage.deleteItem('dsProductvalue');
        this.localStorage.deleteItem('dsProductdropdown');
      } else {

        // tslint:disable-next-line: no-shadowed-variable
        const mapData = ngmodelvalue.map((item) => {
          return item.name;
        });
        this.multiselectedproduct = this.converter.convert(mapData.join('\''));
        this.localStorage.saveItem('dsProductvalue',this.multiselectedproduct);
        this.localStorage.saveObject('dsProductdropdown',mapData);
      }
    }
    if (selectedvaluefromdropdown === 'quarter') {
      // tslint:disable-next-line: prefer-const
      let getquarter, selectedquarter: any = [];
     let qtrsele=[]

      for (let i = 0; i < ngmodelvalue.length; i++) {
        if (ngmodelvalue[i].name === undefined) {
          getquarter = this.quarterList.filter(function (itmes) {
            return itmes.Year === ngmodelvalue[i].Year;
          });
          const a= {
            "Year" : ngmodelvalue[i].Year
          }
          qtrsele.push(a);
          for (let j = 0; j < getquarter.length; j++) {
            selectedquarter.push(getquarter[j]);
          }
        } else {
          selectedquarter.push(ngmodelvalue[i]);
          const b= {
            "name" : ngmodelvalue[i].name
          }
          qtrsele.push(b);
        }
      }
      if (ngmodelvalue.length < 1) {
        //this.selectedPeriod = ['Current'];
        //this.quarterselected = this.encodeValue.encodeStr(this.selectedPeriod);
        this.localStorage.deleteItem('dsQuartervalue');
        this.localStorage.deleteItem('dsQuarterdropdown');
      } else {
        const mapData = selectedquarter.map((item) => {
          return item.name;
        });
        this.quarterselected = this.converter.convert(mapData.join('\''));
        this.localStorage.saveItem('dsQuartervalue',this.quarterselected);
        this.localStorage.saveObject('dsQuarterdropdown',qtrsele);
      }

    }
    // tslint:disable-next-line: max-line-length
    this.httpService.GetTimelineCompareData(this.selectedproductType.name ?
      this.selectedproductType.name : this.selectedproductType, this.selectedfamily, this.quarterselected ?
      this.quarterselected : 'Current', this.multiselectedproduct ? this.multiselectedproduct : 'All')
      .subscribe((types: any) => {
        this.detecteddata1 = types.data.detected_signal_data;
        this.validateddata = types.data.validated_signal_data;
      }
      );
    this.httpService.GetCaseDetails(this.selectedproductType.name ? this.selectedproductType.name :
      this.selectedproductType, this.selectedfamily, this.quarterselected ? this.quarterselected : 'Current',
      this.multiselectedproduct ? this.multiselectedproduct : 'All').subscribe((types: any) => {
        this.showdata1 = types.data;

        const finalarr = [];
        const finalarrcum = [];

        for (let x = 0; x < this.showdata1.length; x++) {
          if (this.showdata1[x].name !== 'Signals') {
          const finalarrq = [];

          const y = this.showdata1[x].series[0].value;
          const z = Object.keys(y);
          const z1 = Object.values(y);
          for (let a = 0; a < z.length; a++) {
              const onj1 = {
              'name': z[a], // this.showdata1[x].series[1].value[1],
              'value': z1[a],
            };
            if (this.showdata1[x].name !== 'Events') {
            finalarrq.push(onj1);
            }
            if (this.showdata1[x].name === 'Events') {
              // tslint:disable-next-line: no-shadowed-variable
              const onj1 = {
                'name': 'Selected Cummulative Events', // this.showdata1[x].series[1].value[1],
                'value': z1[a],
              };
              this.detecteddata1[a].series[this.detecteddata1[a].series.length] = onj1;
            }
          }
          if (this.showdata1[x].name !== 'Events') {
          const onj = {
            'name' : this.showdata1[x].name,
            'series': finalarrq,
          };
          finalarrcum.push(onj);
        }
        }
      }
        this.showcul = finalarrcum;
        for (let x = 0; x < this.showdata1.length; x++) {
          if (this.showdata1[x].name !== 'Signals') {
          const finalarrq = [];

          const y = this.showdata1[x].series[1].value;
          const z = Object.keys(y);
          const z1 = Object.values(y);
          for (let a = 0; a < z.length; a++) {
              const onj1 = {
              'name': z[a], // this.showdata1[x].series[1].value[1],
              'value': z1[a],
            };
            if (this.showdata1[x].name !== 'Events') {
            finalarrq.push(onj1);
            }
            if (this.showdata1[x].name === 'Events') {
              // tslint:disable-next-line: no-shadowed-variable
              const onj1 = {
                'name': 'Selected Period Events', // this.showdata1[x].series[1].value[1],
                'value': z1[a],
              };
              this.detecteddata1[a].series[this.detecteddata1[a].series.length] = onj1;
            }
          }
          if (this.showdata1[x].name !== 'Events') {
          const onj = {
            'name' : this.showdata1[x].name,
            'series': finalarrq,
          };

          finalarr.push(onj);
        }
         }
        }
        // console.log(this.detecteddata);
        this.showcompare1 = finalarr;




        this.detecteddata = this.detecteddata1;

        this.ngxLoader.stop();

      }
      );
    //  this.ngxLoader.stop();

  }

  /**Method to check the item length in selected quarter */
  checkItemsLength(item: any) {
    // console.log('received-item: ', item);
  }

  /**Method to get available domains */
  getProductTypes() {
    this.httpService.GetProductTypes().subscribe((types: any) => {
      const filteredTypes = types.products.filter((item) => {
        return item.count > 500;
      });
      this.productTypes = filteredTypes;
     // this.selectedproductType = 'Drug';
      this.getProducts(this.selectedproductType, this.selectedfamily);

    }
    );
  }

  /**Method to get available quarters */
  getAvailable_Quarters() {
    this.httpService.GetAllQuarters().subscribe((quarter: any) => {
      this.quarterList = quarter.data;
      //this.quarterList.splice(0, 0, { name: 'All', Year: '' });
    },
      (error) => {
        /**to find issue */
        this.validationModal.showMessage('trends quarter issue ' + error, 'error');
      }
    );
  }

  /**Method to get available products, based on domain selection */
  getProducts(item: any, selectedfamily: any ) {
    this.httpService.GetProductsByEvent(item, selectedfamily, 'All').subscribe((eventsproduct: any) => {
      this.productList = eventsproduct.data;
    });
  }

  /**Method on change of domains */
  // onTypeSelect(item: any) {
  //   const sel = item.name;
  //   this.selectedProduct = '';
  //   this.selectedPeriod = ['Current'];
  //   this.getProducts(sel);

  //   this.onChangedropdown('First', 'First');
  // }

  compareAccounts = (item, selected) => {
    if (selected.Year && item.Year) {
      return item.Year === selected.Year;
    }
    if (item.name && selected.name) {
      return item.name === selected.name;
    }
    return false;
  }

  /**Method to get chart data based on change of domian, quarters, products */
  // getDetectedvalidatedData(product_type: any, products: any) {
  //   this.httpService.GetTimelineCompareData(product_type, 'Current', products).subscribe((types: any) => {
  //     this.detecteddata = types.data.detected_signal_data;
  //     this.validateddata = types.data.validated_signal_data;
  //   }
  //   );
  // }

  /**Method to download the page as a image */
  download() {
    htmlToImage.toPng(document.getElementById('timelinedashbaord'))
      .then(function (dataUrl) {
        const link = document.createElement('a');
        link.download = 'TimeLine Dashboard.png';
        link.href = dataUrl;
        link.click();
      });
  }

  formatxAxis(val) {
    if (val % 1 === 0) {
      return val.toLocaleString();
    } else {
      return '';
    }
  }


}
