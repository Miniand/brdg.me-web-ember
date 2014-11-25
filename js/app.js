App = Ember.Application.create();

App.Router.map(function() {
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
