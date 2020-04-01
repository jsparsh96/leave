
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/iron-form/iron-form.js';
import '@vaadin/vaadin-date-picker/vaadin-date-picker.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
import '@polymer/iron-ajax/iron-ajax.js';
import './vaadin-date-validator.js'

/**
* @customElement
* @polymer
*/
class HomePage extends PolymerElement {
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
    #leavesPage{
        grid-row: 1/2;
        grid-column: 3/4;
        
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
    #leavesPage{
        grid-row: 1/2;
        color: white;
        grid-column: 3/4;
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
        width: 25%;
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
    #leaveBtn{
        margin-top: 15px;
        color: white;
    }
</style>
<header>
    <div id="heading">
        <h1>LMS<iron-icon icon="shopping-cart"></iron-icon>
        </h1>
    </div>
    <div id="leavesPage">
    <paper-button id="leaveBtn" on-click="_goToLeaves"><h3>My Leaves</h3></paper-button>
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
    <iron-form id="leaveForm">
        <form>
  <vaadin-date-picker id="fromDate" clear-button-visible min="{{dateToday}}" disabled={{dolidays.date}} label="Select from Date" on-change="_handleChange"></vaadin-date-picker>
  <vaadin-date-picker id="toDate" min="{{minDateForToDate}}" clear-button-visible label="Select To Date" on-change="_handleChange"></vaadin-date-picker>
  <paper-input raised id="reason" type="text" label="Reason(Max. Limit 100)" minlength="2" maxlength="100"></paper-input>
  <paper-button id="submit" on-click="_submitLeave">Submit</paper-button>        
</form>
</iron-form>
</main>
<iron-ajax id="ajax" on-response="_handleResponse" on-error="_handleError" content-type="application/json"
    handle-as="json"></iron-ajax>
`;
    }
    static get properties() {
        return {
            prop1: {
                type: String,
                value: 'login-page'
            },
            action: {
                type: String,
                value: ''
            },
        products: {
            type: Array,
                value: []
        },
        dateToday: {
            type: String
        },
        date:{
            type:String,
            value:''
        }
    };
}
connectedCallback(){
    super.connectedCallback();
    this.user = JSON.parse(sessionStorage.getItem('userDetails'));
    this._makeAjaxCall(`http://localhost:3000/companyHolidays`, 'get', null);
    this.action='List';

    this.dateToday = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`
}

_goToLeaves(){
    window.history.pushState({}, null, '#/leaves');
    window.dispatchEvent(new CustomEvent('location-changed'));
}

_submitLeave(){
    let fromDate =this.$.fromDate.value;
    let toDate = this.$.toDate.value;
    let reason = this.$.reason.value;
    let sapId = this.user.sapId;
    let leaveObj = {fromDate,toDate,reason,sapId};
    this._makeAjaxCall(`http://localhost:3000/leaves`, 'post', leaveObj);
    this.$.leaveForm.reset();

}

_handleChange(){
    this.minDateForToDate = this.$.fromDate.value;
    console.log(this.$.toDate.value);
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
  switch(this.action){
      case 'List':{
          this.holidays= event.detail.response;
          console.log(this.holidays);

          break;
      }
      case '':{
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

window.customElements.define('home-page', HomePage);