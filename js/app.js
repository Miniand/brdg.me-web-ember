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
		return this.store.find('game', {
			gameState: 'active'
		});
	}
});

App.GamesShowRoute = Ember.Route.extend({
	loadedFresh: false,
	beforeModel: function() {
		this.loadedFresh = false;
	},
	model: function(params) {
		this.loadedFresh = true;
		return this.store.find('game', params.id);
	},
	afterModel: function(model) {
		// If we didn't hit the DB, force a reload.
		if (!this.loadedFresh) {
			return model.reload();
		}
	}
});
App.GamesShowController = Ember.ObjectController.extend({
	command: '',
	actions: {
		sendCommand: function() {
			toastr.info('sending command ' + this.get('command'));
			this.set('command', '');
			this.get('model').reload();
		}
	},
	// Scroll log when new logs come in
	logChanged: function() {
		if (this.get('model.log')) {
			Ember.run.scheduleOnce('afterRender', this, function() {
				var logDiv = $('.game-log')[0];
				logDiv.scrollTop = logDiv.scrollHeight;
			});
		}
	}.observes('model.log')
});

// Application controller handles auth
App.ApplicationController = Ember.Controller.extend({
	authToken: localStorage.getItem('token'),
	authEmail: '',
	authConfirm: '',
	requesting: false,
	actions: {
		requestAuth: function() {
			var controller = this;
			this.set('requesting', true);
			$.ajax('http://brdg.me/auth/request', {
				type: 'POST',
				data: {
					email: this.get('authEmail')
				},
				error: function() {
					controller.set('requesting', false);
					alert('Unable to request auth, please ensure you have entered a valid email address.');
				}
			});
			alert('Please check your email for a confirmation code.');
		},
		confirmAuth: function() {
			var controller = this;
			$.ajax('http://brdg.me/auth/confirm', {
				type: 'POST',
				data: {
					email: this.get('authEmail'),
					confirmation: this.get('authConfirm')
				},
				success: function(data) {
					alert('You logged in and your token is ' + data);
					controller.set('authToken', data);
					localStorage.setItem('token', data);
				},
				error: function() {
					controller.set('requesting', false);
					alert('Unable to confirm, please check the email and confirmation code is correct.');
				}
			});
		}
	}
});

// Data / API stuff
App.Game = DS.Model.extend({
	commands: DS.attr(),
	game: DS.attr(),
	log: DS.attr(),
	identifier: DS.attr(),
	isFinished: DS.attr(),
	name: DS.attr(),
	playerList: DS.attr(),
	whoseTurn: DS.attr(),
	winners: DS.attr()
});
App.GameSerializer = DS.RESTSerializer.extend({
	normalizePayload: function(payload) {
		return {
			game: payload
		};
	}
});
App.ApplicationAdapter = DS.RESTAdapter.extend({
	pathForType: function(type) {
		// Disable pluralisation
		return type;
	},
	headers: function() {
		return {
			Authorization: 'token ' + localStorage.getItem('token')
		};
	}.property().volatile(),
	host: 'http://brdg.me'
});
