var musicApp = angular.module('musicApp',[]);

musicApp.controller('musicJSONController', ['$scope','$interval','$http','$sce', function ($scope,$interval,$http, $sce){
	
	$http.get("http://localhost:3000/musicJSON").success(function(response){
		$scope.chords = response.chords;
		$scope.notes = response.notes;
		$scope.body = response.body;
		$scope.query = response.query;
		$scope.NOTES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
		$scope.explicitlyTrustedHtml = $sce.trustAsHtml(String($scope.body));
		$scope.searchForm = {};
		$scope.searchForm.title = "Nothing Else Matters";
		$scope.searchForm.numberOfChords = response.chords.length;
		$scope.tempo = 500;
		$scope.chord = null;
		$scope.state = "stopped";

		$scope.initialize = function( ) {
			Synth.setVolume(0.00);
			$scope.NOTES.forEach(function(note){
				Synth.play('piano',note,4,2);
			});
			Synth.setVolume(1.00);
		};

		// Initializing all notes....
		$scope.initialize();
	

		$scope.searchForm.submitTheForm = function(){
			console.log("--> Submitting searchForm");
			console.log($scope.searchForm.title);

			var song = $scope.searchForm.title;

			$http.get("http://localhost:3000/searchSongJSON/?q=" + song).success(function(response){
				$scope.chords = response.chords;
				$scope.notes = response.notes;
				$scope.body = response.body;
				$scope.query = response.query;
				$scope.NOTES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
				$scope.explicitlyTrustedHtml = $sce.trustAsHtml(String($scope.body));
				$scope.searchForm.title = song;
				$scope.searchForm.numberOfChords = response.chords.length;
			});	

		}


		$scope.getNumberOfChords = function(){
			return $scope.chords.length;
		};

		$scope.getAutoNumberOfColumns = function( ){
			
			var result = "col-xs-1";

			switch($scope.getNumberOfChords()) {
			    case 1:
			        result = "col-xs-12";
			        break;
			    case 2:
			        result = "col-xs-6";
			        break;
			    case 3:
			    	result = "col-xs-4";
			    	break;
		    	case 4:
		    		result = "col-xs-3";
		    		break;
	    		case 5:
	    			result = "col-xs-2";
	    			break;
    			case 6:
    				result = "col-xs-2";
    				break;
			    default:
			        result = "col-xs-1";
			}
			return result;
		};

		$scope.playChord = function(){
			$scope.notes.forEach(function(noteObject){
				for (var key in noteObject){
					if (key == $scope.chord) {
						var notesIndex = noteObject[key];
						notesIndex.forEach(function(noteIndex){
							var note = $scope.NOTES[noteIndex%12];
							Synth.play('piano',note,4,2);
						});
						return;
					}
				}
			});
		}

		var setInterval;

		//allows changing of tempo while it is playing
		var anonyfn = function(){
			$interval.cancel(setInterval);

			$scope.playChord();

			setInterval = $interval(anonyfn, $scope.tempo);
		}

		$scope.repeatPlayingChord = function(chord) {
			$scope.chord = chord;
			if ($scope.state === "stopped") {
				$scope.state = "playing";
				setInterval = $interval(anonyfn, $scope.tempo);	
			}
		}

		$scope.getTempo = function() {
			return $scope.tempo;
		}

		$scope.setTempo = function(tempo) {
			$scope.tempo = tempo;
		}

		$scope.increaseTempo = function(increaseBy) {
			tempo = $scope.getTempo();
			newtempo = tempo - increaseBy;
			//console.log("tempo set to %s", String(newtempo));
			$scope.setTempo(newtempo);
		}

		$scope.decreaseTempo = function(decreaseBy) {
			tempo = $scope.getTempo();
			newtempo = tempo + decreaseBy;
			//console.log("tempo set to %s", String(newtempo));
			$scope.setTempo(newtempo);
		}

		$scope.stopPlayingChord = function( ) {
			if($scope.state === "playing"){
				$interval.cancel(setInterval);
				$scope.state = "stopped";
			}
		}

		
		
	});


	angular.isDefined(stop)

	
}]);





