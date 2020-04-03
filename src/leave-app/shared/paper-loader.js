import '@polymer/paper-spinner/paper-spinner.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/polymer/lib/elements/dom-if.js';
import '@polymer/paper-dialog/paper-dialog.js';

class PaperLoader extends PolymerElement {
    static get template() {
        return html`
        <style>
            paper-spinner{
                position:fixed;
                margin-left:50% ;
                top:50%;         
                width:30px;      
            }

        </style>
        <template is="dom-if" if={{display}}>
        <paper-spinner active></paper-spinner>
        </template>

        `;

    }
        static get properties() {
            return {
              display:{
                  type:Boolean,
              }
            };
          }
}
window.customElements.define('paper-loader', PaperLoader);
