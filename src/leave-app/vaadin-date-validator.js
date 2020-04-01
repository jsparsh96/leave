import '@vaadin/vaadin-date-picker/vaadin-date-picker.js';
import '@vaadin/vaadin-date-picker/theme/material/vaadin-date-picker.js';
import { PolymerElement } from '@polymer/polymer';

  customElements.whenDefined('vaadin-date-picker').then(function() {
    class VaadinDateValidator extends PolymerElement {
      checkValidity(value) {
        if (new Date(value).getDay() == 0 || new Date(value).getDay() == 6) {
          return false;
        }
        return true;
      }
    }
    if (!customElements.get('vaadin-date-validator')) {
      customElements.define('vaadin-date-validator', VaadinDateValidator);
    }
  });
