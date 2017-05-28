$(function(){
	var results1 = $('#results1');
	var results2 = $('#results2');
	var base_url = 'https://image.tmdb.org/t/p/w500';
	var selectStatus1 = false;
	var selectStatus2 = false;

	// Make background the right size
	var topHeight = $('.topContainer').height();
	var height = $(window).height();
	var heightDiff = (height-topHeight);
	$('.popular').css('height', heightDiff);

	// Put instructions in middle
	$('.instructions').css('top', (heightDiff/3-150));
	$('.instructions').css('left', ( ($(window).width()/2)) - $('.instructions').width()/2 );

	// =========================================================
	// ===================== SEARCH BAR 1 ======================
	// =========================================================
	// Type in search bar
	$('#search1').keyup(function(){
		$('.instructions').fadeOut('slow');
		$('.compareOverlay').addClass('compareOverlayOn');
		var s = $(this).val();
		$.ajax({
			url: '//api.themoviedb.org/3/search/movie?api_key=2f2eeb2adf28348173d2b4b625713bb1&query='+s+'&language=en&include_image_language=en,null',
			success: function(movie) {
				$.each(movie.results, function(i, value){
						var movieTitle = $('#results1 li h2:visible:contains("'+movie.results[i].original_title+'")');
						var lang = $('#results1 li h2:visible:contains("en")');
						if (movie.results[i].poster_path == null || movieTitle.text == movie.results[i].original_title || !lang) {
						} else { // Put all results in DOM
							var id = movie.results[i].id;
							var release = movie.results[i].release_date;
							var rating = movie.results[i].vote_average;
							var lang = movie.results[i].original_language;
							var genres = movie.results[i].genre_ids.toString();
							results1.append('<li class="movieResult">' + '<img class="poster-search left" src="' + base_url + movie.results[i].poster_path + '?api_key=2f2eeb2adf28348173d2b4b625713bb1">' + '<h2>' + movie.results[i].original_title + '</h2><p class="truncate light">' + movie.results[i].overview + '</p><div class="attributes1" data-id="'+ id +'" data-release="'+release+'" data-rating="'+ rating +'" data-lang="'+ lang +'" data-genre="'+genres+'"></div></li>');
							$('.attributes1Container').html('<div class="attributes1" data-id="'+ id +'" data-release="'+release+'" data-rating="'+ rating +'" data-lang="'+ lang +'" data-genre="'+genres+'"></div>');
							return i < 5;
						}
				});

				// Hover to add active class

				// Click on search result & show its data
				$('.movieResult').click(function(){

					var id = $(this).children('.attributes1').data('id');
					var poster = $(this).children('img').attr('src');
					var title = $(this).children('h2').text();

					$.ajax({
						url: '//api.themoviedb.org/3/movie/'+id+'?api_key=2f2eeb2adf28348173d2b4b625713bb1&append_to_response=videos',
						success: function(data){
							var release = data.release_date.toString().split('-');
							var releaseYear = release[0];
							var genres = data.genres;
							var rating = data.vote_average;
							rating = rating/2;
							var partialStar = (rating % 1).toFixed(2);
							var ratingWhole = Math.ceil(rating) + 1;
							var runtime = data.runtime;
							var budget = data.budget;
							var revenue = data.revenue;
							var video = data.videos.results;
							$.each(video, function(i, vid){
								if (i == 0)
									$('.trailer1').attr('href', '//youtube.com/watch?v='+vid.key);
							});
							$('.attributes1Container').html('<div id="attributes1" class="attributes1" data-runtime="'+ runtime +'" data-budget="'+ budget +'" data-revenue="'+ revenue +'"></div>');
							if (budget == 0)
								budget = "N/A";
							else
								budget = '$' + budget;
							if (revenue == 0)
								revenue = "N/A";
							else
								revenue = '$' + revenue;

							// Add commas to budget & revenue
							$.fn.digits = function(){
							  return this.each(function(){
									$(this).text( $(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") );
							  })
							}

							// Release year
							$('.released1').html('<b>Released:</b> ' + releaseYear);

							// Ratings
							$('.stars1').html('');
							for (var i = 0; i < ratingWhole; i++) {
								$('.stars1').append(
									'<i class="fa fa-star"></i>'
								);
							}
							// Handle decimal rating (partial star) with an overlay
							if (partialStar != 0) {
								$('.stars1').before('<div class="stars1-cover-wrapper"><div class="stars1-cover"></div></div>');
								var width = $('.fa-star').width();
								$('.stars1-cover').css('right', ((ratingWhole)*width)-((1-partialStar)*width));
							}
							$('.rating1').html(rating);

							// Genre
							$('.genre1').html('');
							$.each(genres, function(i, genre){
								$('.genre1').append(genre.name.toString() + ', ');
							});
							if (genres.length > 1)
								$('.genre1').html('<b>Genres:</b> '+$('.genre1').text().slice(0, -2)); // Remove comma on last item
							else if (genres.length == 1)
								$('.genre1').html('<b>Genre:</b> '+$('.genre1').text().slice(0, -2)); // Remove comma on last item

							// Runtime
							$('#runtime1').text(runtime+' minutes');

							// Budget
							$('#budget1').text(budget).digits();

							// Profits
							$('#revenue1').text(revenue).digits();

							// Show elements
							$('.hidden, .hidden1').fadeIn('slow');

							// Show call to action
							$('.cta2').fadeIn('slow');
							$('.cta2Title').text(title);

// Movie one is ready to be compared
selectStatus1 = true;

if (selectStatus1 && selectStatus2) {
	// If inflation button is on, turn it off
	if ($('.inflation_checkbox').prop('checked') == true)
		$('.inflation_label').trigger('click');

	// Hide CTA 1
	$('.cta1, cta1Title, .cta2, .cta2Title').hide();
	// Show graphs
	$('.comparedata').fadeIn();
	// Make the background bigger
	var botHeight = $('.comparedata').height();
	var heightAdd = botHeight + 12;
	$('.popular').css('height', heightAdd);

	var runtime1 = $('#attributes1').data('runtime');
	var runtime2 = $('#attributes2').data('runtime');
	var budget1 = $('#attributes1').data('budget');
	var budget2 = $('#attributes2').data('budget');
	var revenue1 = $('#attributes1').data('revenue');
	var revenue2 = $('#attributes2').data('revenue');

	// Make the higher of the two runtimes at 80% and the other relative to it
	if (runtime1 > runtime2) {
		var longerRuntime = '80%';
		var shorterRuntime = (.8*(runtime2/runtime1))*100+'%';
		$('.graph-runtime1').css('width', longerRuntime);
		$('.graph-runtime2').css('width', shorterRuntime);
	} else if (runtime2 > runtime1) {
		var longerRuntime = '80%';
		var shorterRuntime = (.8*(runtime1/runtime2))*100+'%';
		$('.graph-runtime1').css('width', shorterRuntime);
		$('.graph-runtime2').css('width', longerRuntime);
	} else if (runtime1 == runtime2) {
		$('.graph-runtime1').css('width', '50%');
		$('.graph-runtime2').css('width', '50%');
	}


	// if budget1 > all
	if (budget1 > revenue1 && budget1 > revenue2 && budget1 > budget2) {
		var longerBudget = '100%';
		var shorterBudget = (1*(budget2/budget1))*100+'%';
		$('.graph-budget1').css('width', longerBudget);
		$('.graph-budget2').css('width', shorterBudget);

		// calc revenue
		var rev1 = (revenue1/budget1)*100+'%';
		var rev2 = (revenue2/budget1)*100+'%';
		$('.graph-revenue1').css('width', rev1);
		$('.graph-revenue2').css('width', rev2);
	}

	// if budget2 > all
	else if (budget2 > revenue1 && budget2 > revenue2 && budget2 > budget1) {
		var longerBudget = '100%';
		var shorterBudget = (1*(budget1/budget2))*100+'%';
		$('.graph-budget1').css('width', shorterBudget);
		$('.graph-budget2').css('width', longerBudget);

		// calc revenue
		var rev1 = (revenue1/budget2)*100+'%';
		var rev2 = (revenue2/budget2)*100+'%';
		$('.graph-revenue1').css('width', rev1);
		$('.graph-revenue2').css('width', rev2);
	}

	// if revenue1 > all
	else if (revenue1 > budget1 && revenue1 > budget2 && revenue1 > revenue2) {
		var longerRevenue = '100%';
		var shorterRevenue = (1*(revenue2/revenue1))*100+'%';
		$('.graph-revenue1').css('width', longerRevenue);
		$('.graph-revenue2').css('width', shorterRevenue);

		// calc budget
		var budget1 = (budget1/revenue1)*100+'%';
		var budget2 = (budget2/revenue1)*100+'%';
		$('.graph-budget1').css('width', budget1);
		$('.graph-budget2').css('width', budget2);

	// if revenue2 > all
	} else if (revenue2 > budget1 && revenue2 > budget2 && revenue2 > revenue1) {
		var longerRevenue = '100%';
		var shorterRevenue = (1*(revenue1/revenue2))*100+'%';
		$('.graph-revenue1').css('width', shorterRevenue);
		$('.graph-revenue2').css('width', longerRevenue);

		// calc budget
		var budget1 = (budget1/revenue2)*100+'%';
		var budget2 = (budget2/revenue2)*100+'%';
		$('.graph-budget1').css('width', budget1);
		$('.graph-budget2').css('width', budget2);
	} else {
		// Didn't assess which number was highest correctly...
	}

} // End if both movies are selected


// Resize popular movie tile background
if ($('.comparedata').css('display') == 'none') {
	var topHeight = $('.topContainer').height();
	var height = $(window).height();
	if (height > topHeight)
		var heightDiff = (height-topHeight);
	var botHeight = $('.comparedata').height();
	var heightAdd = botHeight + 12;
	$('.popular').css('height', heightDiff);
} else {
	$('.popular').css('height', heightAdd);
}

						} // End success AJAX call for specific movie selected
					});

					$('.movieResult').hide();
					$('#poster1').attr('src', poster);
					$('#title1').text(title);
					$('#search1').val(title);
				});

				$(':not(.movieResult)').click(function() {
					$('.movieResult').hide();
				});

				$('#search1').click(function(){
					$(this).val('');
				});

			} // End success AJAX call for search

		}); // End AJAX

	}); // End keyup search bar 1
	// End search 1







	// =========================================================
	// ===================== SEARCH BAR 2 ======================
	// =========================================================
	// Type in search bar
	$('#search2').keyup(function(){
		$('.instructions').fadeOut('slow');
		var s = $(this).val();
		$.ajax({
			url: '//api.themoviedb.org/3/search/movie?api_key=2f2eeb2adf28348173d2b4b625713bb1&query='+s+'&language=en&include_image_language=en,null',
			success: function(movie) {
				$.each(movie.results, function(i, value){
						var movieTitle = $('#results2 li h2:visible:contains("'+movie.results[i].original_title+'")');
						var lang = $('#results2 li h2:visible:contains("en")');
						if (movie.results[i].poster_path == null || movieTitle.text == movie.results[i].original_title || !lang) {
						} else { // Put all results in DOM
							var id = movie.results[i].id;
							var release = movie.results[i].release_date;
							var rating = movie.results[i].vote_average;
							var lang = movie.results[i].original_language;
							var genres = movie.results[i].genre_ids.toString();
							results2.append('<li class="movieResult2">' + '<img class="poster-search left" src="' + base_url + movie.results[i].poster_path + '?api_key=2f2eeb2adf28348173d2b4b625713bb1">' + '<h2>' + movie.results[i].original_title + '</h2><p class="truncate light">' + movie.results[i].overview + '</p><div class="attributes2" data-id="'+ id +'" data-release="'+release+'" data-rating="'+ rating +'" data-lang="'+ lang +'" data-genre="'+genres+'"></div></li>');
							return i < 5;
						}
				});

				// Click on search result & show its data
				$('.movieResult2').click(function(){

					var id = $(this).children('.attributes2').data('id');
					var poster = $(this).children('img').attr('src');
					var title = $(this).children('h2').text();

					$.ajax({
						url: '//api.themoviedb.org/3/movie/'+id+'?api_key=2f2eeb2adf28348173d2b4b625713bb1&append_to_response=videos',
						success: function(data){
							var release = data.release_date.toString().split('-');
							var releaseYear = release[0];
							var genres = data.genres;
							var rating = data.vote_average;
							rating = rating/2;
							var partialStar = (rating % 1).toFixed(2);
							var ratingWhole = Math.ceil(rating);
							var runtime = data.runtime;
							var budget = data.budget;
							var revenue = data.revenue;
							var video = data.videos.results;
							$.each(video, function(i, vid){
								if (i == 0)
									$('.trailer2').attr('href', '//youtube.com/watch?v='+vid.key);
							});
							$('.attributes2Container').html('<div id="attributes2" class="attributes2" data-runtime="'+ runtime +'" data-budget="'+ budget +'" data-revenue="'+ revenue +'"></div>');
							if (budget == 0)
								budget = "N/A";
							else
								budget = '$' + budget;
							if (revenue == 0)
								revenue = "N/A";
							else
								revenue = '$' + revenue;

							// Add commas to budget & revenue
							$.fn.digits = function(){
							  return this.each(function(){
									$(this).text( $(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") );
							  })
							}

							// Release year
							$('.released2').html('<b>Released:</b> ' + releaseYear);

							// Ratings
							$('.stars2').html('');
							for (var i = 0; i < ratingWhole; i++) {
								$('.stars2').append(
									'<i class="fa fa-star"></i>'
								);
							}
							// Handle decimal rating (partial star) with an overlay
							if (partialStar != 0) {
								$('.stars2').before('<div class="stars2-cover-wrapper"><div class="stars2-cover"></div></div>');
								var width = $('.fa-star').width();
								$('.stars2-cover').css('left', ((ratingWhole)*width)-((1-partialStar)*width));
							}
							$('.rating2').html(rating);

							// Genre
							$('.genre2').html('');
							$.each(genres, function(i, genre){
								$('.genre2').append(genre.name.toString() + ', ');
							});
							if (genres.length > 1)
								$('.genre2').html('<b>Genres:</b> '+$('.genre2').text().slice(0, -2)); // Remove comma on last item
							else if (genres.length == 1)
								$('.genre2').html('<b>Genre:</b> '+$('.genre2').text().slice(0, -2)); // Remove comma on last item

							// Runtime
							$('#runtime2').text(runtime+' minutes');

							// Budget
							$('#budget2').text(budget).digits();

							// Profits
							$('#revenue2').text(revenue).digits();

							// Show elements
							$('.hidden, .hidden2').fadeIn('slow');

							// Show call to action
							$('.cta1').fadeIn('slow');
							$('.cta1Title').text(title);

// Movie two is ready to be compared
selectStatus2 = true;

if (selectStatus1 && selectStatus2) {
	// If inflation button is on, turn it off
	if ($('.inflation_checkbox').prop('checked') == true)
		$('.inflation_label').trigger('click');

	// Hide CTA 2
	$('.cta1, cta1Title, .cta2, .cta2Title').hide();
	// Show graphs
	$('.comparedata').fadeIn();
	// Make the background bigger
	var botHeight = $('.comparedata').height();
	var heightAdd = botHeight + 12;
	$('.popular').css('height', heightAdd);

	var runtime1 = $('#attributes1').data('runtime');
	var runtime2 = $('#attributes2').data('runtime');
	var budget1 = $('#attributes1').data('budget');
	var budget2 = $('#attributes2').data('budget');
	var revenue1 = $('#attributes1').data('revenue');
	var revenue2 = $('#attributes2').data('revenue');

	// Make the higher of the two runtimes at 80% and the other relative to it
	if (runtime1 > runtime2) {
		var longerRuntime = '80%';
		var shorterRuntime = (.8*(runtime2/runtime1))*100+'%';
		$('.graph-runtime1').css('width', longerRuntime);
		$('.graph-runtime2').css('width', shorterRuntime);
	} else if (runtime2 > runtime1) {
		var longerRuntime = '80%';
		var shorterRuntime = (.8*(runtime1/runtime2))*100+'%';
		$('.graph-runtime1').css('width', shorterRuntime);
		$('.graph-runtime2').css('width', longerRuntime);
	} else if (runtime1 == runtime2) {
		$('.graph-runtime1').css('width', '50%');
		$('.graph-runtime2').css('width', '50%');
	}


	// if budget1 > all
	if (budget1 > revenue1 && budget1 > revenue2 && budget1 > budget2) {
		var longerBudget = '100%';
		var shorterBudget = (1*(budget2/budget1))*100+'%';
		$('.graph-budget1').css('width', longerBudget);
		$('.graph-budget2').css('width', shorterBudget);

		// calc revenue
		var rev1 = (revenue1/budget1)*100+'%';
		var rev2 = (revenue2/budget1)*100+'%';
		$('.graph-revenue1').css('width', rev1);
		$('.graph-revenue2').css('width', rev2);
	}

	// if budget2 > all
	else if (budget2 > revenue1 && budget2 > revenue2 && budget2 > budget1) {
		var longerBudget = '100%';
		var shorterBudget = (1*(budget1/budget2))*100+'%';
		$('.graph-budget1').css('width', shorterBudget);
		$('.graph-budget2').css('width', longerBudget);

		// calc revenue
		var rev1 = (revenue1/budget2)*100+'%';
		var rev2 = (revenue2/budget2)*100+'%';
		$('.graph-revenue1').css('width', rev1);
		$('.graph-revenue2').css('width', rev2);
	}

	// if revenue1 > all
	else if (revenue1 > budget1 && revenue1 > budget2 && revenue1 > revenue2) {
		var longerRevenue = '100%';
		var shorterRevenue = (1*(revenue2/revenue1))*100+'%';
		$('.graph-revenue1').css('width', longerRevenue);
		$('.graph-revenue2').css('width', shorterRevenue);

		// calc budget
		var budget1 = (budget1/revenue1)*100+'%';
		var budget2 = (budget2/revenue1)*100+'%';
		$('.graph-budget1').css('width', budget1);
		$('.graph-budget2').css('width', budget2);

	// if revenue2 > all
	} else if (revenue2 > budget1 && revenue2 > budget2 && revenue2 > revenue1) {
		var longerRevenue = '100%';
		var shorterRevenue = (1*(revenue1/revenue2))*100+'%';
		$('.graph-revenue1').css('width', shorterRevenue);
		$('.graph-revenue2').css('width', longerRevenue);

		// calc budget
		var budget1 = (budget1/revenue2)*100+'%';
		var budget2 = (budget2/revenue2)*100+'%';
		$('.graph-budget1').css('width', budget1);
		$('.graph-budget2').css('width', budget2);
	} else {
		// Didn't assess which number was highest correctly...
	}

} // End if both movies are selected




// Resize popular movie tile background
if ($('.comparedata').css('display') == 'none') {
	var topHeight = $('.topContainer').height();
	var height = $(window).height();
	if (height > topHeight)
		var heightDiff = (height-topHeight);
	var botHeight = $('.comparedata').height();
	var heightAdd = botHeight + 12;
	$('.popular').css('height', heightDiff);
} else {
	$('.popular').css('height', heightAdd);
}

						} // End success AJAX call for specific movie selected
					});

					$('.movieResult').hide();
					$('#poster2').attr('src', poster);
					$('#title2').text(title);
					$('#search2').val(title);
				});

				$(':not(.movieResult2)').click(function() {
					$('.movieResult2').hide();
				});

				$('#search2').click(function(){
					$(this).val('');
				});

			} // End success AJAX call for search

		}); // End AJAX

	}); // End keyup search bar 2
	// End search 2


$('.trailer1, .trailer2').click(function(e) {
	var vid = $(this).attr('href').split('v=')[1];
	var ampersandPosition = vid.indexOf('&');
	if(ampersandPosition != -1) {
	  vid = vid.substring(0, ampersandPosition);
	}
	e.preventDefault();
	$('.overlay').fadeIn('slow');
	$('body').prepend('<div class="videoContainer"><!-- <div class="x"></div> --><iframe src="https://www.youtube.com/embed/'+vid+'?autoplay=1&modestbranding=1&controls=0" frameborder="0" allowfullscreen></iframe></div>');
});

$('.overlay, .x').click(function(e) {
	e.stopPropagation();
  $('.videoContainer, .overlay, .x').hide();
  $('.videoContainer iframe').attr('src', '');
});

}) // Page loaded





// ==============================================================
// ===================== Get popular movies =====================
// ==============================================================
var base_url = 'https://image.tmdb.org/t/p/w500';
var url = '//api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=2f2eeb2adf28348173d2b4b625713bb1'

$.ajax({
	url: url,
	success: function(data) {
		var popularMovies = data.results;
		$.each(popularMovies, function(i, value) {
			var img = value.backdrop_path;
			$('.popular').append('<img class="tile" src="'+base_url+img+'?api_key=2f2eeb2adf28348173d2b4b625713bb1">');
		});
	},
	error: function() {
		alert('nope');
	}
});


// ==============================================================
// ===================== Resize background ======================
// ==============================================================
$(window).resize(function(){
	if ($('.comparedata').css('display') == 'none') {
		var topHeight = $('.topContainer').height();
		var height = $(window).height();
		if (height > topHeight)
			var heightDiff = (height-topHeight);
		var botHeight = $('.comparedata').height();
		var heightAdd = botHeight + 12;
		$('.popular').css('height', heightDiff);
	} else {
		$('.popular').css('height', heightAdd);
	}

	// Put instructions in middle
	$('.instructions').css('top', (heightDiff/3-150));
	$('.instructions').css('left', ( ($(window).width()/2)) - $('.instructions').width()/2 );
});
