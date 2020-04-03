
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-toast/paper-toast.js';
import '@vaadin/vaadin-date-picker/vaadin-date-picker.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
import '@polymer/iron-ajax/iron-ajax.js';
import './shared/paper-loader.js';
/**
* @customElement
* @polymer
*/
class LeavesPage extends PolymerElement {
    static get template() {
        return html`
<style>
    main {
        border-radius: 8px;
        align-self: center;
    }
    iron-form{
        padding:20px;
    }
    h1 {
        justify-self: center;
        color: white;
    }
    header {
        display: grid;
        grid-template-columns: 250px 1fr 200px 200px 100px;
        grid-template-rows: 100px;
        height: 100px;
        width: 100%;
        background-color: #000000;
    }
    #logoutBtn{
        margin-left:20%;
        margin-top:30%;
    }
    #logout {
        grid-row: 1/2;
        grid-column: 5/6;
    }
    #userName {
        grid-row: 1/2;
        grid-column: 4/5;
        color:white;
        margin-top:10%;
    }
    #heading {
        margin: 10px;
        font-size: 1.4em;
        grid-row: 1/2;
        grid-column: 1/2;
    }
    #leaveForm{
        background-color: #c8dff5;
        border-radius: 5%;
        display: flex;
        width: 40%;
        margin: 30px auto;
    }
  #submit{
      background-color: #000000;
      color: white;
      width: 100%;
      margin-top: 8px;
  }
    paper-card{
        background-color: rgb(216, 211, 211);
        margin-top:2%;
        width:100%;
    }
    iron-icon {
        color: red;
    }
    vaadin-date-picker{
        width: 100%;
    }
    #homePage{
        grid-row: 1/2;
        color: white;
        grid-column: 3/4;
    }
    #homeBtn{
        margin-top: 15px;
        color: white;
    }
    table{
        margin-top: 3%;
        width: 100%;
        text-align: center;
        border-collapse:collapse;
    }
    thead{
        font-weight:bold;
    }
    tr,td{
        border:1px dashed black;
    }
</style>
<header>
    <div id="heading">
        <h1>LMS</h1>
    </div>
    <div id="homePage">
        <paper-button id="homeBtn" on-click="_goToHome"><h3>Home</h3></paper-button>
    </div>
    <div id="userName">
        <h2>Welcome, {{user.name}}</h2>
    </div>
    <div id="logout">
        <paper-button id="logoutBtn" on-click="_handleLogout">
            <iron-icon icon="power-settings-new"></iron-icon>
        </paper-button>
    </div>
</header>
    <main>
        <table>
            <thead>
                <tr>
                    <td>From date</td>
                    <td>To Date</td>
                    <td>Reason</td>
                    <td>Action</td>
                </tr>
            </thead>
            <tbody>
                <template is="dom-repeat" items={{leaves}}>
                    <tr>
                        <td>{{item.fromDate}}</td>
                        <td>{{item.toDate}}</td>
                        <td>{{item.reason}}</td>
                        <td><paper-button id="cancel" raised on-click="_handleCancel">Cancel</paper-button></td>
                    </tr>
                </template>
            </tbody>
        </table>
    </main>
<paper-toast id="toast" text="{{message}}"></paper-toast>
<paper-loader display={{display}}></paper-loader>
<iron-ajax id="ajax" on-response="_handleResponse" on-error="_handleError" content-type="application/json"
    handle-as="json"></iron-ajax>
`;
    }
    static get properties() {
        return {
            action: {
                type: String,
                value: ''
            },
            leaves: {
                type: Array,
                value: []
            },
            dateToday: {
                type: String
            },
            date: {
                type: String,
                value: ''
            },
            display:{
                type:Boolean,
                value:false
            }
        };
    }
    connectedCallback() {
        super.connectedCallback();
        this.user = JSON.parse(sessionStorage.getItem('userDetails'));
        this.display=true;
        this._makeAjaxCall(`${BaseUrl}/leaves?sapId=${this.user.sapId}`, 'get', null);
        this.action = 'List';
    }

    /**
     * Direct To Home Page
     */
    _goToHome() {
        window.history.pushState({}, null, '#/home');
        window.dispatchEvent(new CustomEvent('location-changed'));
    }

    /**
     * 
     * @param {object} event
     * Cancel the Leave Applied 
     */
    _handleCancel(event) {
        console.log("here");
        console.log(event.model.item)
        this.id = event.model.item.id;
        this._makeAjaxCall(`${BaseUrl}/leaves/${this.id}`, 'delete', null);
        this.message = 'Deleted';
        this.$.toast.open();
    }

    /**
     * Logout is performed here
     */
    _handleLogout() {
        sessionStorage.clear();
        window.history.pushState({}, null, '#/login');
        window.dispatchEvent(new CustomEvent('location-changed'));
    }

    /**
     * @param {*} event
     * response from the backend is handled here 
     */
    _handleResponse(event) {
        this.display=false;
        switch (this.action) {
            case 'List': {
                this.leaves = event.detail.response;
                console.log(this.leaves);
                break;
            }

        }
    }

    /**
    * function to make ajax calls
    * @param {String} url 
    * @param {String} method 
    * @param {Object} postObj 
    */
    _makeAjaxCall(url, method, postObj, action) {
        const ajax = this.$.ajax;
        ajax.method = method;
        ajax.url = url;
        ajax.body = postObj ? JSON.stringify(postObj) : undefined;
        ajax.generateRequest();
    }
}

window.customElements.define('leaves-page', LeavesPage);