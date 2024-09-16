import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })

export class GenericDomainProductFamily {
  selectProductFamilyType() {
    const types = [
      { 'id': 0, 'name': 'Individual Product' },
      { 'id': 1, 'name': 'Product Family' }
    ];
    return types;
  }

  getValidationList() {
    const list = [
      { 'id': -1, 'itemName': 'To be validated' },
      { 'id': 1, 'itemName': 'Valid' },
      { 'id': 2, 'itemName': 'Signal Already Validated' },
      { 'id': 3, 'itemName': 'Previously evaluated and closed' },
      { 'id': 4, 'itemName': 'Lack of efficacy' },
      { 'id': 5, 'itemName': 'Underlying Condition' },
      { 'id': 6, 'itemName': 'Limited Information' },
      { 'id': 7, 'itemName': 'Alternative Explanation' },
      { 'id': 8, 'itemName': 'Validation in Progress' },
      { 'id': 9, 'itemName': 'Listed' },
      { 'id': 10, 'itemName': 'Associated with listed' },
    ];
    return list;
  }
}
