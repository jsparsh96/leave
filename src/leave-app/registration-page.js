import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-toast/paper-toast.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/iron-ajax/iron-ajax.js';
import './shared/paper-loader.js';

/**
 * @customElement
 * @polymer
 */
class RegistrationPage extends PolymerElement {
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
        paper-button{
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
        iron-icon{
            color:red;
        }
        header{
            display: grid;
            grid-template-columns: 250px 1fr 1fr 100px 30px;
            grid-template-rows: 100px;
            height: 100px;
            width: 100%;
            background-color:black;
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
      <iron-form id="register">
      <form>
      <paper-input id="name" required value={{name}} type="text" name="customerName" allowed-pattern=[a-zA-Z] label="Enter Name" > </paper-input>
      <paper-input id="email" required value={{email}} type="email" error-message="Email Id must contain '@' symbol" name="emailIs"  label="Enter Email Id" > </paper-input>
      <paper-input id="sapId" required value={{sapId}} allowed-pattern=[0-9] label="Enter SAP Id" minlength="8" maxlength="8"> </paper-input>
      <paper-input id="phone" required value={{phone}} name="phoneNo" allowed-pattern=[0-9] label="Enter Contact Number" minlength="13" maxlength="13" allowed-pattern=^[\-\+0-9]{1,15}$> </paper-input>
      <paper-input id="password" value={{password}} required name="password" type="password" label="Enter Password"></paper-input>
      <paper-button raised id="registerBtn" on-click="_handleRegister">Register</paper-button>
        </form>
        </iron-form>
      </main>
      </div>
      <paper-loader display={{display}}></paper-loader>
      <paper-toast id="toast" text={{message}}></paper-toast>
      <iron-ajax id="ajax" on-response="_handleResponse" on-error="_handleError" content-type="application/json" handle-as="json"></iron-ajax>
   
    `;
  }
  static get properties() {
    return {
      message:{
          type:String,
          value:''
      },
      display:{
          type:Boolean,
          value:false
      }
    };
  }

   /**
    * validation of the user form is done and then registration
    */
  _handleRegister() {

    if (this.$.register.validate()) {
      let userObj = {name:this.name,emailId:this.email,sapId:this.sapId, phone:parseInt(this.phone), password:this.password};
      console.log(userObj);
      this.display=true;
      this._makeAjaxCall(`${Window.BaseUrl}/users`, 'post', userObj);
      this.message='Registered Successfully...!!!'
      this.$.toast.open();
      this.$.register.reset();
      this.display=false;
      window.history.pushState({},null,'#/login');
      window.dispatchEvent(new CustomEvent('location-changed'));

    }
  }


_handleError(){
  this.display=false;
  this.message = 'Network Error';
  this.$.toast.open();
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

window.customElements.define('registration-page', RegistrationPage);