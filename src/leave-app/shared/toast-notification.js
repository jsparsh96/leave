import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-toast/paper-toast.js';


class ToastNotification extends PolymerElement{
    static get template(){
        return html
        `
        <style>
        </style>

        `;
    }
    static get properties(){
        return {
            
        }
    };

}
window.customElements.define('toast-notification', ToastNotification);
