var React = require('react');
var LoginBox = require("./LoginBox.jsx");
var MenuBox = require("./MenuBox.jsx");
var PageEditPanel = require("./page/PageEditPanel.jsx");
var ElementsPanel = require("./page/ElementsPanel.jsx");
var ErrorBox = require("./ErrorBox.jsx");
var ColorPickerBox = require("./colors/ColorPickerBox.jsx");
var ThemeBox = require("./themes/ThemeBox.jsx");
var FontBox = require("./fonts/FontBox.jsx");
var Koala = require('../../library.jsx');

var AdminBox = React.createClass({
    getInitialState: function() {
        return {
            admin_id: null,
            currentUser: null,
            error: null,
            popUp: null,
            message: null,
            menuItem: "pages"
        };
    },

    componentDidMount: function() {
        var url = this.props.site + "/";
        Koala.request("get", url + "general")
        .then(function(data) {
            this.setState({admin_id: data[0].admin_id})
        }.bind(this));
        setInterval(function() {
            var num = (Math.round(Math.random()*5) + 1);
            if (num > 5) {
                num = 5;
            }
            this.setState({popUp: '/static/home/images/koala.png', message: `/static/admin/images/${num}.png`}, function() {
                setTimeout(function() {
                    this.setState({popUp: null})
                    this.setState({message: null})
                }.bind(this), 5000)
            }.bind(this))
        }.bind(this),30000);
    },

    login: function(confirmed) {
        if (confirmed.user) {
            Koala.setCookie('EucalyptusUser', confirmed.user, 30);
            this.setState({currentUser: confirmed.user});
        } else {
            this.setState({error: confirmed.error});
        }
    },

    setMenuItem: function(item) {
        if (item === "logout") {
            Koala.deleteCookie('EucalyptusUser');
            this.setState({menuItem: "pages", currentUser: null});
        } else {
            this.setState({menuItem: item});
        }
    },

    render: function() {
        var popUp = null;
        var message = null;
        var display = null;
        if(this.state.popUp && this.state.currentUser) {
            popUp = (<img className='koalaHelper' src={this.state.popUp}></img>)
            message = (<img className='message' src={this.state.message}></img>)
        }

        if (this.state.currentUser) {
            display = (
                <div className="page-container">
                    <MenuBox setMenuItem={this.setMenuItem} />
                    <PageEditPanel site={this.props.site} menuItem={this.state.menuItem} />
                </div>
            );
        } else {
            display = (
                <div>
                    <LoginBox login={this.login} admin_id={this.state.admin_id} site={this.props.site}/>
                    <ErrorBox errorMessage={this.state.error} />
                </div>
            );
        }

        return (
            <div className="overall-container">
                {popUp}
                {message}
                {display}
            </div>
        );
    }

});

module.exports = AdminBox;
