import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private stateChanged = new BehaviorSubject(false);
  change = this.stateChanged.asObservable();

  private commentUpdated = new BehaviorSubject(false);
  isCommentUpdated = this.commentUpdated.asObservable();

  private methodChanged = new BehaviorSubject('');
  mc = this.methodChanged.asObservable();

  private reDirect = new BehaviorSubject<Object>({});
  private reDirectValidate = new BehaviorSubject<Object>({});
  private reDirectEvaluate = new BehaviorSubject<Object>({});
  currentObj = this.reDirect.asObservable();
  currentValidateObj = this.reDirectValidate.asObservable();
  currentEvaluateObj = this.reDirectEvaluate.asObservable();

  // remote server
  private BASE_URL = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }


  getallquarters = this.BASE_URL + 'dash_board/available_quarters/';

  // signal detection end points
  availableproducts = this.BASE_URL + 'available_products/';
  statisticalMethods = this.BASE_URL + 'available_statistical_methods/';
  availableAEs = this.BASE_URL + 'available_AEs/';
  signalDetection = this.BASE_URL + 'signal_detection/';
  productTypes = this.BASE_URL + 'available_product_types/';
  icsrList = this.BASE_URL + 'related_icsrs/';
  individualIcsrDetail = this.BASE_URL + 'icsr_details/';
  updateIcsrComment = this.BASE_URL + 'icsr_details/update_comment/';
  updateStatisticalSignal = this.BASE_URL + 'statsig_updation/';
  getUnhandledSignals = this.BASE_URL + 'detected_unhandled_signals/';
  countrylistUrl = this.BASE_URL + 'countries/';
  availableQuarterUrl = this.BASE_URL + 'dash_board/available_quarters/';
  unhandledSignalsFilter = this.BASE_URL + 'filters/stat_sig/by_method/';
  downloadapi = this.BASE_URL + 'download/prod_event_cases/';

  /*Signal Tracking end points */
  getValidSignals = this.BASE_URL + 'valid_signals/';
  getSignalFilter = this.BASE_URL + 'signal-filter/';
  updateSignal = this.BASE_URL + 'signal_tracking_update/';
  usersList = this.BASE_URL + 'all_user_list/';
  planningProdDetsUrl = this.BASE_URL + 'planning/get_product_details/';
  planningUpdateUrl = this.BASE_URL + 'planning/update_product/';
  customSignalUrl = this.BASE_URL + 'ser/add_custom_tracking_object/';
  downloadAllCaseUrl = this.BASE_URL + 'filters/prod_event_cases/';
  deleteValidateSignal = this.BASE_URL + 'signal_tracking_delete/';


  /* Dashboards end points */
  getProductCountByDomain = this.BASE_URL + 'dash_board/count_of_product_by_domain/';
  getProductsByEventname = this.BASE_URL + 'dash_board/products_wrt_event/';
  getEventByProducts = this.BASE_URL + 'dash_board/events_wrt_products/';
  getTotalCasesCount = this.BASE_URL + 'dash_board/case_count/';
  getProductCount = this.BASE_URL + 'dash_board/products_count/';
  getEventCount = this.BASE_URL + 'dash_board/events_count/';


  getProductSignalsProgress = this.BASE_URL + 'dashboards/signal_progress/';
  getProductEventDetails = this.BASE_URL + 'dashboards/num_products_wrt_event/';
  getCumulativeDetails = this.BASE_URL + 'dashboards/cumulative_details_per_product/';
  getAvailableDates = this.BASE_URL + 'dashboards/available_dates/';
  getAllUsers = this.BASE_URL + 'admin_dashboard/user_details/';
  updateAdminUser = this.BASE_URL + 'admin_dashboard/update_user/';
  createUser = this.BASE_URL + 'admin_dashboard/create_user/';
  caseCountUrl = this.BASE_URL + 'dash_board/get_case_count/';
  dataMiningUrl = this.BASE_URL + 'data_mining/';


  /**signal analytics end points */
  availableEventsUrl = this.BASE_URL + 'dash_board/available_events/';
  commonUrl = this.BASE_URL + 'dash_board/';
  commonDataUrl = this.BASE_URL + 'dash_board/';
  narrativeUrl = this.BASE_URL + 'case_details/';
  snCommentUrl = this.BASE_URL + 'dash_board/get_comment_of_stat_sig/';

  quarterUrl = this.BASE_URL + 'dash_board/available_quarters/';

  signaldetectedUrl = this.BASE_URL + 'dash_board/signals_detected_details/';
  siganlValidatedUrl = this.BASE_URL + 'dash_board/signals_validated_details/';
  siganlstatusUrl = this.BASE_URL + 'dash_board/signals_details_valid_invalid/';

  signalEvalUrl = this.BASE_URL + 'dash_board/signals_evaluated_details/';
  top5product = this.BASE_URL + 'dash_board/top_five_products/';
  signalgrade = this.BASE_URL + 'dash_board/grade_details/';

  // fitering api end points
  sigDetfUrl = this.BASE_URL + 'filters/stat_sig/by_method/';
  sigDetfpUrl = this.BASE_URL + 'filters/stat_sig/by_product_method/';
  evalDetfUrl = this.BASE_URL + 'filters/evaluated_signals/by/status/';
  sigTrafUrl = this.BASE_URL + 'filters/validated/by_status/';
  sigTragfUrl = this.BASE_URL + 'filters/validated/by_grade/';
  sigDetByType = this.BASE_URL + 'filters/stat_sig_by_type/by_status/';
  sigTrackingAllFilterfUrl = this.BASE_URL + 'filters/validated/by_status/';

  /*Password related End points */
  resetPassword = this.BASE_URL + 'password_reset_otp/';
  passwordVerification = this.BASE_URL + 'password_set_otp_verification/';
  changePassword = this.BASE_URL + 'change_password/';

  /*Signal evaluation report end points */
  getCurrentSignals = this.BASE_URL + 'ser/current_signals/';
  getSignalReport = this.BASE_URL + 'ser/signal_report_return/';
  saveSignalReport = this.BASE_URL + 'ser/save_ser/';
  completeSignalReport = this.BASE_URL + 'ser/submit_ser/';
  unlockreport = this.BASE_URL + 'ser/signal_free_lock/';


  saveComment = this.BASE_URL + 'ser/save_comment/';
  latestCommentsUrl = this.BASE_URL + 'ser/get_latest_comments/';
  allCommentsUrl = this.BASE_URL + 'ser/get_comment/';

  /*Audit trail*/
  getAuditTrail = this.BASE_URL + 'audit_trail/';

  /**Cases Page*/
  getCases = this.BASE_URL + 'icsr_total_count/';
  getCasesCount = this.BASE_URL + 'icsrs_by_count/';


  gethierarchy = this.BASE_URL + 'dash_board/hierarchy/';
  timelinecomapre = this.BASE_URL + 'dash_board/get_cumulative_data_compare/';
  timelinecomaprecasedetails = this.BASE_URL + 'dash_board/cases_overview/';

  downlaoddetails = this.BASE_URL + 'download/new_report_id/';

  nextChange(message: boolean) {
    this.stateChanged.next(message);
  }

  makeComment(isUpdated: boolean) {
    this.commentUpdated.next(isUpdated);
  }

  onMethodChange(name: string) {
    this.methodChanged.next(name);
  }

  // redirect filters in dashboard
  setParameters(reDirect: Object) {
    this.reDirect.next(reDirect);
  }

  setValidateParameters(validate: Object) {
    this.reDirectValidate.next(validate);
  }

  setEvaluateParameters(evaluate: Object) {
    this.reDirectEvaluate.next(evaluate);
  }

  getParameters(): Observable<any> {
    return this.reDirect.asObservable();
  }

  /*signal detection API methods start */
  public GetProductTypes() {
    return this.httpClient.get(this.productTypes);
  }

  public GetAvailableProducts(productType: string, isProdFamSel: any) {
    return this.httpClient.get(this.availableproducts + productType + '/' + isProdFamSel + '/');
  }

  public GetStatisticalMethods() {
    return this.httpClient.get(this.statisticalMethods);
  }

  public GetAEs(productType: string, isProdFamSel: any, selectedProduct: string, selectedHierarchy: string) {
    return this.httpClient.get(this.availableAEs + productType + '/' + isProdFamSel + '/' +
     selectedProduct + '/' + selectedHierarchy + '/');
  }

  public GetSignalDetectionReports(selType: string, isProdFamSel: any, selMet: string, selProd: string, selHierarchy , selAE: string) {
    return this.httpClient.get(this.signalDetection + selType + '/' + isProdFamSel + '/'  + selMet + '/' + selProd + '/' + selHierarchy + '/' + selAE + '/');
  }

  public GetIcsrList(selType: string, isProdFamSel: any, selProd: string, selAE: string, quarters: any, sC: any, eC: any) {
    return this.httpClient.get(this.icsrList + selType + '/' + isProdFamSel + '/' +
    selProd + '/' + selAE + '/' + quarters +  '/' + sC + '/' + eC + '/');
  }

  public GetIndividualICSRDetails(icsrId: string) {
    return this.httpClient.get(this.individualIcsrDetail + icsrId + '/');
  }

  public UpdateIndividualICSRCommentReport(aer_num: any, comment: any) {
    const formData: FormData = new FormData();
    formData.append('aer_number', aer_num);
    formData.append('comment', comment);
    // formData.append('is_pt', model.isPt);
    return this.httpClient.post(this.updateIcsrComment, formData);
  }


  public UpdateStatisticalSignal(model: any) {
    const formData: FormData = new FormData();
    formData.append('signal_id', model.signalId);
    formData.append('comment', model.comment);
    // to be added is_pt for all post methods from signal detection, signal tracking, signal evaluation
    formData.append('is_valid', model.isValid);
    formData.append('is_pt', model.isPt);
    return this.httpClient.post(this.updateStatisticalSignal, formData);
  }

  public GetUnhandledSignals() {
    return this.httpClient.get(this.getUnhandledSignals);
  }

  public GetCountryList(type: any, p: any, e: any) {
    return this.httpClient.get(this.countrylistUrl + type + '/' + p + '/' + e + '/');
  }


  public GetAvailableQaurters() {
    return this.httpClient.get(this.availableQuarterUrl);
  }

  // tslint:disable-next-line:max-line-length
  public GetFilteredUnhandledSignals(pType: string, isProdFamSel: any, quarters: string, products: string, event: string, method: string, shCom: any, sCount: any, eCount: any) {
    // tslint:disable-next-line:max-line-length
    return this.httpClient.get(this.unhandledSignalsFilter + pType + '/' + isProdFamSel + '/' + quarters + '/' + products + '/' + event + '/' + method + '/' + shCom + '/' + sCount + '/' + eCount + '/');
  }

  public GetFilteredTypeUnhandledSignals(ty: any, isProdFamSel: any, q: any, p: any, e: any, tyMet: any, sC: any, eC: any) {
    return this.httpClient.get(this.sigDetByType + ty + '/' + isProdFamSel + '/' + q + '/' +
     p + '/' + e + '/' + tyMet + '/' + sC + '/' + eC + '/');
  }
  /*signal detection methods ends */


  /*Signal Tracking methods starts */
  public GetValidSignals() {
    return this.httpClient.get(this.getValidSignals);
  }

  public FilterSignals(status: string, type: string, startDate: string, endDate: string) {
    return this.httpClient.get(this.getSignalFilter + status + '/' + type + '/' + startDate + '/' + endDate + '/');
  }

  public UpdateSignal(model: any) {
    const formData: FormData = new FormData();
    formData.append('signal_id', model.signalId);
    formData.append('comment', model.comment);
    formData.append('priority', model.priority);
    formData.append('target_date', model.targetDate);
    formData.append('status', model.status);
    formData.append('reason', model.reason);
    formData.append('assigned_to', model.user);
    formData.append('is_Pt', model.isPt);
    formData.append('is_custom', model.isCustom);
    return this.httpClient.post(this.updateSignal, formData);
  }

  public downloaddetails(url: any, module_name: any, type: any) {
    const formData: FormData = new FormData();
    formData.append('url', url);
    formData.append('module_name', module_name);
    formData.append('type_name', type);
    return this.httpClient.post(this.downlaoddetails, formData);
  }
  public GetUsersList() {
    return this.httpClient.get(this.usersList);
  }

  public GetPlanningProdDetails(type: any, prodfamily: any) {
    return this.httpClient.get(this.planningProdDetsUrl + type + '/' + prodfamily + '/');
  }

  public UpdatePlanningProd(ptype: any, selectfam: any, period: any, sm: any, pN: any) {

    const httpOptions = {
      headers: new HttpHeaders({
       'Content-Type': 'multipart/form-data'
      })
    };
    const fd: FormData = new FormData();
    fd.append('product_type', ptype);
    fd.append('is_product_family', selectfam);
    fd.append('periodicity', period);
    fd.append('signaling_method', sm);
    fd.append('product_name', pN);
    return this.httpClient.post(this.planningUpdateUrl, fd);
  }

  public CreateCustomSignal(model: any) {
    const fd: FormData = new FormData();
    fd.append('product_type', model.type);
    fd.append('product_name', model.name);
    fd.append('event_name', model.event);
    fd.append('comment', model.comment);
    return this.httpClient.post(this.customSignalUrl, fd);
  }

  public DownloadCases(ty: any, prodfam: any, qu: any, prod: any, eve: any) {
    return this.httpClient.get(this.downloadAllCaseUrl + ty + '/' + prodfam + '/' + qu + '/' + prod + '/' + eve + '/');

  }
  public DownloadCaseCount(ty: any, prodfam: any, qu: any, prod: any, eve: any, module_name: any, url: any) {
    // return this.httpClient.get(this.downloadapi + ty + '/' + prodfam + '/' + qu + '/' + prod + '/' + eve, {
    //   responseType: 'arraybuffer'
    // });

    const fd: FormData = new FormData();
    fd.append('product_type', ty);
    fd.append('quarters', qu);
    fd.append('event', eve);
    fd.append('products', prod);
    fd.append('is_product_family', prodfam);
    fd.append('module_name', module_name);
    fd.append('url', url);

    return this.httpClient.post(this.downloadapi, fd, {
      responseType: 'arraybuffer'});
  }
  /*Signal Tracking methods ends */


  /*Dashboard Methods starts */
  public GetProductCountByDomain() {
    return this.httpClient.get(this.getProductCountByDomain );
  }

  public GetTotalCaseCount(type: any, prodfam: any, prod: any, event: any) {
    return this.httpClient.get(this.caseCountUrl + type + '/' + prodfam + '/' + prod + '/' + event + '/');
  }

  public GetSignalsProgress() {
    return this.httpClient.get(this.getProductSignalsProgress);
  }

  public GetProductEventDetails(startDate: Date, endDate: Date) {
    return this.httpClient.get(this.getProductEventDetails + startDate + '/' + endDate + '/');
  }

  public GetCummulativeDetails(startDate: Date, endDate: Date) {
    return this.httpClient.get(this.getCumulativeDetails + startDate + '/' + endDate + '/');
  }

  public GetAvailabelDates() {
    return this.httpClient.get(this.getAvailableDates);
  }

  public GetUsers() {
    return this.httpClient.get(this.getAllUsers);
  }

  public UpdateAdminUser(model: any) {
    const formData: FormData = new FormData();
    formData.append('id', model.id);
    formData.append('is_admin', model.is_admin);
    formData.append('name', model.name);
    formData.append('is_safety_group', model.is_safety_group);
    formData.append('is_manager', model.is_manager);
    formData.append('is_active', model.is_active);
    formData.append('email', model.email);
    return this.httpClient.post(this.updateAdminUser, formData);
  }
  public CreateUser(model: any) {
    const formData: FormData = new FormData();
    formData.append('username', model.userName);
    formData.append('email', model.email);
    formData.append('name', model.name);
    formData.append('is_admin', model.isAdmin);
    formData.append('is_safety_group', model.isSafetyGroup);
    formData.append('is_manager', model.isManager);
    formData.append('is_active', model.isActive);
    return this.httpClient.post(this.createUser, formData);
  }

  public GetDetFilteredSignalsbyMethod(ty: any, qu: any, ev: any, met: any) {
    return this.httpClient.get(this.sigDetfUrl + ty + '/' + qu + '/' + ev + '/' + met + '/');
  }

  public GetDetFilteredSignalsbyProd(ty: any, qu: any, ev: any, met: any, pName: any) {
    return this.httpClient.get(this.sigDetfpUrl + ty + '/' + qu + '/' + ev + '/' + met + '/' + pName + '/');
  }

  public GetValFilteredSignalsbyStatus(ty: any, prodfamily: any, qu: any, p: any, ev: any, stVal: any) {
    return this.httpClient.get(this.sigTrafUrl + ty + '/' + prodfamily + '/' + qu + '/' + p + '/' + ev + '/' + stVal + '/');
  }

  public GetValFilteredSignalsbyGrade(ty: any, qu: any, p: any,  ev: any, grade: any) {
    return this.httpClient.get(this.sigTragfUrl + ty + '/' + qu + '/' + p + '/' + ev + '/' + grade + '/');
  }

  public GetEvalFilteredSignalsbyStatus(ty: any, prodfamily: any, qu: any, p: any, ev: any, stVal: any) {
    return this.httpClient.get(this.evalDetfUrl + ty + '/' + prodfamily + '/' + qu + '/' +  p + '/' + ev + '/' + stVal + '/');
  }

  public RunDataMining() {
    return this.httpClient.get(this.dataMiningUrl);
  }


  /*Dashboard Methods ends*/

  /*Password Related Methods starts */
  public PasswordReset(email: any) {
    const formData: FormData = new FormData();
    formData.append('email', email);
    return this.httpClient.post(this.resetPassword, formData);
  }

  public PasswordVerification(model: any) {
    const formData: FormData = new FormData();
    formData.append('email', model.email);
    formData.append('otp', model.otp);
    formData.append('password', model.password);
    formData.append('confirm_password', model.confirmPassword);
    return this.httpClient.post(this.passwordVerification, formData);
  }
  public ChangePassword(model: any) {
    const formData: FormData = new FormData();
    formData.append('current_password', model.oldPassword);
    formData.append('password1', model.newPassword);
    formData.append('password2', model.confirmPassword);
    return this.httpClient.post(this.changePassword, formData);
  }
  /*Password Related Methods ends */

  /*Signal Evaluation report methods starts */
  public GetCurrentSignals() {
    return this.httpClient.get(this.getCurrentSignals);
  }

  /**To do */
  // pass o when ispt false, pass 1 when ispt true
  public GetSignalReport(reportId: any, isCustom: any) {
    return this.httpClient.get(this.getSignalReport + reportId + '/' + isCustom + '/');
  }

  public SaveSignalReport(reportId: any, signalCode: any, file: any, isCustom: any) {
    const formData: FormData = new FormData();
    formData.append('report_id', reportId);
    formData.append('code', signalCode);
    formData.append('report', file);
    formData.append('is_custom', isCustom);
    return this.httpClient.post(this.saveSignalReport, formData);
  }
  public CompleteSignalReport(reportId: any, signalCode: any, file: any, isCustom: any) {
    const formData: FormData = new FormData();
    formData.append('report_id', reportId);
    formData.append('code', signalCode);
    formData.append('report', file);
    formData.append('is_custom', isCustom);
    return this.httpClient.post(this.completeSignalReport, formData);
  }
  public UnLockReport(reportId: any, isCustom: any) {

    return this.httpClient.get(this.unlockreport + reportId + '/' + isCustom + '/');
  }
  public SaveComment(reportId: any, comment: any, sectionId: any, isCustom: any) {
    const fd: FormData = new FormData();
    fd.append('report_id', reportId);
    fd.append('comment', comment);
    fd.append('section_id', sectionId);
    fd.append('is_custom', isCustom);
    return this.httpClient.post(this.saveComment, fd);
  }

  public GetLatestComments(reportId: any, isCustom: any) {
    return this.httpClient.get(this.latestCommentsUrl + reportId + '/' + isCustom + '/');
  }

  public GetComments(sectionId: any, reportId: any, isCustom: any) {
    return this.httpClient.get(this.allCommentsUrl + sectionId + '/' + reportId + '/' + isCustom + '/');
  }
  /*Signal Evaluation report methods ends */


  /*Audit trail methods starts */
  public GetAuditTrail(type: string, from: any, to: any) {
    return this.httpClient.get(this.getAuditTrail + type + '/' + from + '/' + to + '/');
  }
  /*Audit trail methods ends */


  /*Cases Page Methods starts */
  public GetCases() {
    return this.httpClient.get(this.getCases);
  }

  public GetCasesCount(start: any, end: any) {
    return this.httpClient.get(this.getCasesCount + start + '/' + end + '/' );
  }
  /**Cases Page Methods ends */

  /**dashboard signal analytics methods */
  public GetAvailableEvents(pt: any, prodfamily, p: any) {
    return this.httpClient.get(this.availableEventsUrl + pt + '/' + prodfamily + '/' + p  + '/');
  }

  public GetData(pt: any, prodfamily: any, param: any, product: any, event: any) {
    return this.httpClient.get(this.commonUrl +  param + '/' +  pt + '/' + prodfamily + '/' + product + '/' + event + '/' );
  }

  public GetSACasesData(pt: any, prodfamily: any, param: any, p: any, e: any, item: any, startindex: any, endindex: any) {
    return this.httpClient.get(this.commonDataUrl + param + '/' + pt + '/' + prodfamily + '/' +
     p + '/' + e + '/' + item + '/' + startindex + '/' + endindex + '/');
  }

  public GetSAIndiReport(id) {
    return this.httpClient.get(this.narrativeUrl + id + '/');
  }

  public GetAvailable_Quarters() {
    return this.httpClient.get(this.quarterUrl);
  }
  public GetSignalAnalyticsComment(type: any, prodfamily: any, product: any, event: any) {
    return this.httpClient.get(this.snCommentUrl + type + '/' + prodfamily + '/' + product + '/' + event + '/');
  }
  public UpdateSignalAnalyticsComment(model: any) {
    const formData: FormData = new FormData();
    formData.append('signal_id', model.signalId);
    formData.append('comment', model.comment);
    return this.httpClient.post(this.updateStatisticalSignal, formData);
  }



  /**Method related to dashboard */
  public GetSignalDetected(prdt_type: any, isProdFamSel: any, Quarter: any, MedH: any, event: any) {
    return this.httpClient.get(this.signaldetectedUrl + prdt_type + '/' + isProdFamSel +  '/' + Quarter + '/' + MedH + '/' + event + '/');
  }

  public GetSignalValidated(prdt_type: any, isProdFamSel: any, Quarter: any, MedH: any, event: any) {
    return this.httpClient.get(this.siganlValidatedUrl + prdt_type + '/' + isProdFamSel + '/' + Quarter + '/' + MedH + '/' + event + '/');
  }

  public GetSignalStatus(prdt_type: any, isProdFamSel: any, Quarter: any, MedH: any, event: any) {
    return this.httpClient.get(this.siganlstatusUrl + prdt_type + '/' + isProdFamSel + '/' + Quarter + '/' + MedH + '/' + event + '/');
  }

  public GetSignalEval(prdt_type: any, isProdFamSel: any, Quarter: any, MedH: any, event: any) {
    return this.httpClient.get(this.signalEvalUrl + prdt_type + '/' + isProdFamSel + '/' + Quarter + '/' + MedH + '/' + event + '/');
  }

  public GetTop5product(prdt_type: any, Quarter: any, MedH: any, event: any) {
    return this.httpClient.get(this.top5product + prdt_type + '/' + Quarter + '/' + MedH + '/' + event + '/');
  }

  public GetSignalGrade(prdt_type: any, Quarter: any, MedH: any, event: any) {
    return this.httpClient.get(this.signalgrade + prdt_type + '/' + Quarter + '/' + MedH + '/' + event + '/');
  }

  public GetHDataList(hierarchy: any) {
    return this.httpClient.get(this.gethierarchy + hierarchy + '/');
  }

  public GetTimelineCompareData(product_type: any, prod_family: any, Quarter: any , product: any) {
    return this.httpClient.get(this.timelinecomapre + product_type + '/' + prod_family + '/' + Quarter + '/' + product + '/');
  }

  public GetProductsByEvent(drug_name: any, isProdFamSel: any, event_name: any) {
    return this.httpClient.get(this.getProductsByEventname + drug_name + '/' + isProdFamSel + '/' + event_name + '/');
  }

  public GetEventsByProduct(drug_name: any, isProdFamSel: any, prod_name: any) {
    return this.httpClient.get(this.getEventByProducts + drug_name + '/' + isProdFamSel + '/' + prod_name + '/');
  }

  public GetAllQuarters() {
    return this.httpClient.get(this.getallquarters);
  }

  public GetTotalCasesCount(prdt_type: any, isProdFamSel: any, Quarter: any, MedH: any, event: any) {
    return this.httpClient.get(this.getTotalCasesCount + prdt_type + '/' + isProdFamSel + '/' + Quarter + '/' + MedH + '/' + event + '/');
  }

  public GetProductCount(prdt_type: any, isProdFamSel: any, Quarter: any, MedH: any, event: any) {
    return this.httpClient.get(this.getProductCount + prdt_type + '/' + isProdFamSel + '/' + Quarter + '/' + MedH + '/' + event + '/');
  }

  public GetEventCount(prdt_type: any, isProdFamSel: any, Quarter: any, MedH: any, event: any) {
    return this.httpClient.get(this.getEventCount + prdt_type + '/' + isProdFamSel + '/' + Quarter + '/' + MedH + '/' + event + '/');
  }

  public GetCaseDetails(product_type: any, prod_family: any, Quarter: any , product: any) {
    return this.httpClient.get(this.timelinecomaprecasedetails + product_type + '/' + prod_family + '/' + Quarter + '/' + product + '/');
  }

  public GetSignalTrackingDataWithAllFilter(product_type: any, quarters: any,
    products: any, event: any, status_val: any, code: any, status: any,
    reported_date_from: any, reported_date_to: any, validation_date_from: any,
    validation_date_to: any, target_date_from: any, target_date_to: any,
    priority: any, assigned_to: any, is_custom: any, start_count: any, end_count: any) {
    const formData: FormData = new FormData();
    formData.append('product_type ', product_type);
    formData.append('quarters', quarters);
    formData.append('products ', products);
    formData.append('event ', event);
    formData.append('status_val', status_val);
    formData.append('code ', code);
    formData.append('status ', status);
    formData.append('target_date_from', target_date_from);
    formData.append('target_date_to ', target_date_to);
    formData.append('reported_date_from', reported_date_from);
    formData.append('reported_date_to ', reported_date_to);
    formData.append('validation_date_from', validation_date_from);
    formData.append('validation_date_to', validation_date_to);
    formData.append('priority', priority);
    formData.append('assigned_to', assigned_to);
    formData.append('is_custom', is_custom);
    formData.append('start_count ', start_count);
    formData.append('end_count', end_count);
    // formData.append('is_pt', model.isPt);
    return this.httpClient.post(this.sigTrackingAllFilterfUrl, formData);
  }
  public DeletevalidateSignal(model: any) {
    const formData: FormData = new FormData();
    formData.append('code', model.code);
    formData.append('is_custom', model.is_custom);
    // to be added is_pt for all post methods from signal detection, signal tracking, signal evaluation
    formData.append('comment', model.comment);
    return this.httpClient.post(this.deleteValidateSignal, formData);
  }
}
