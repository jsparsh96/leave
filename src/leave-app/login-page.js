import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-toast/paper-toast.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/iron-ajax/iron-ajax.js';
import './shared/paper-loader.js';

/**
 * @customElement
 * @polymer
 */
class LoginPage extends PolymerElement {
    static get template() {
        return html`
      <style>
        main{
          border-radius:8px;
background-color:rgb(216, 211, 211);
          width:30%;
          height:20%;
          align-self:center;
        }
        iron-form{
          padding:20px;
        }
        #loginBtn{
            background-color: #000000;
            color: white;
          margin-top:20px;
          width: 100%;
        }
        #container{
          display:flex;
          justify-content:center;
          margin-top:3%;
        }
        h1{
            justify-self: center;
            color: white;
        }
        header{
            display: grid;
            grid-template-columns: 250px 1fr 1fr 100px 30px;
            grid-template-rows: 100px;
            height: 100px;
            width: 100%;
            background-color: #000000; 
       }
       /* #logout{
           grid-row: 1/2;
           grid-column: 4/5;
       } */
       #heading{
           margin: 10px;
           font-size: 1.4em;
           grid-row: 1/2;
           grid-column: 1/2;
       }
       #registerBtn{
        color:blue;
       }
       iron-icon{
            color:red;
        }
      </style>
      <header>
          <div id="heading">
              <h1>LMS</h1>
          </div>
          <!-- <div id="logout">
              <paper-button>fgh</paper-button>
          </div> -->
      </header>
      <div id="container">
      <main>
      <iron-form id="login">
      <form>
      <paper-input id="sapId" required allowed-pattern=[0-9] label="Enter SAP Id" minlength="8" maxlength="8"> </paper-input>
      <paper-input id="password" required name="password" type="password" label="Enter Password"></paper-input>
      <paper-button raised id="loginBtn" on-click="_handleLogin">Login</paper-button>
      <sub>New Here?<paper-button id="registerBtn" on-click="_handleRegister">Register</paper-button></sub>
        </form>
        </iron-form>
      </main>
      </div>
      <paper-loader display={{display}}></paper-loader>
      <paper-toast id="toast0" text={{message}}></paper-toast>
      <iron-ajax id="ajax" on-response="_handleResponse" on-error="_handleError" content-type="application/json" handle-as="json"></iron-ajax>
   
    `;
    }
    /**
   * Properties used here are defined here with some respective default value.
   */
    static get properties() {
        return {
            userData: {
                type: Array,
                value: []
            },
            display:{
                type:Boolean,
                value:false
            }
        };
    }

    /**
      *  validates if the user exist and logs in to the user portal
      */
    _handleLogin() {
        if (this.$.login.validate()) {
            let password = this.$.password.value;
            let sapId = this.$.sapId.value;
            this.display=true;
            this._makeAjaxCall(`${BaseUrl}/users?sapId=${sapId}&&password=${password}`, 'get', null);

        }
    }

    /**
     * Button for a new user registration
     */
    _handleRegister() {
        window.history.pushState({}, null, '#/registration');
        window.dispatchEvent(new CustomEvent('location-changed'));
    }

     /**
     * @param {*} event 
     * handling the response for the ajax request made
     */
    _handleResponse(event) {
        this.userData = event.detail.response[0];
        this.display=false;
        if (this.userData != null) {
            console.log(this.userData);
            sessionStorage.setItem('userDetails', JSON.stringify(this.userData));
            window.history.pushState({}, null, '#/home');
            window.dispatchEvent(new CustomEvent('location-changed'));
            this.$.login.reset();
        }
        else {
            this.message = 'Invalid Credentials'
            this.$.toast0.open();
        }
    }

     /**
    * function to make ajax calls
    * @param {String} url 
    * @param {String} method 
    * @param {Object} postObj 
    */
    _makeAjaxCall(url, method, postObj) {
        const ajax = this.$.ajax;
        ajax.method = method;
        ajax.url = url;
        ajax.body = postObj ? JSON.stringify(postObj) : undefined;
        ajax.generateRequest();
    }
}

window.customElements.define('login-page', LoginPage);