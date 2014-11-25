App = Ember.Application.create();

App.Router.map(function() {
	this.route("home", { path: "/" });
	this.resource("games", function() {
		this.route("new");
		this.route("show", { path: "/:id" });
	});
});

App.GamesIndexRoute = Ember.Route.extend({
	model: function(params) {
		return [{
			name: "Roll Through The Ages",
			id: "1234-5678",
			players: ["beefsack@gmail.com", "baconheist@gmail.com"]
		}, {
			name: "Acquire",
			id: "1235-567878",
			players: ["beefsack@gmail.com", "baconheist@gmail.com"]
		}];
	}
});

App.GamesShowRoute = Ember.Route.extend({
	model: function(params) {
		return {
			name: "Roll Through The Ages",
			id: params.id,
			players: ["beefsack@gmail.com", "baconheist@gmail.com"]
		};
	}
});

App.ApplicationController = Ember.Controller.extend({
	authToken: localStorage.getItem('token'),
	authEmail: '',
	authConfirm: '',
	requesting: false,
	actions: {
		requestAuth: function() {
			this.set('requesting', true);
			$.ajax('http://brdg.me/auth/request', {
				type: 'POST',
				data: {
					email: this.get('authEmail')
				},
				error: function() {
					self.set('requesting', false);
					alert('Unable to request auth, please ensure you have entered a valid email address.');
				}
			});
			alert('Please check your email for a confirmation code.');
		},
		confirmAuth: function() {
			var self = this;
			$.ajax('http://brdg.me/auth/confirm', {
				type: 'POST',
				data: {
					email: this.get('authEmail'),
					confirmation: this.get('authConfirm')
				},
				success: function(data) {
					alert('You logged in and your token is ' + data);
					self.set('authToken', data);
					localStorage.setItem('token', data);
				},
				error: function() {
					self.set('requesting', false);
					alert('Unable to confirm, please check the email and confirmation code is correct.');
				}
			});
		}
	}
});
