# Implementation of Movie Database
* Please run server locally from https://github.com/michaelOptix1/starter-express-api.
* Run the implementation with `npm install` and `npm start`.

The app uses server running on port 3000 (default).

The code is based on Material UI library and its API. Next tasks were considered:

Must have(s)

* Display total number of movies.
* Table must show:
    * Movie titles
    * Average review score (to 1 decimal place)
    * Company that produces the film.
* Movie company data comes from `movieCompanies` GET request.
* Movies data comes from `movies` GET request.
* User must be able to select table row to leave a review with form appearing when there is a selected movie.
* Request to `submitReview` endpoint and display message returned on response.
* Form must restrict message to 100 characters and show an error message if over 100 and not allow for submission in this instance.
* Highlight selected movie row when clicked.
* Handle error and loading states.

Should have(s)

* Reviews column should be sortable.
* Submit review form should appear in a modal on mobile devices or small breakpoints.

Could have(s)

* Add a button (or other mechanism) to refresh movies and movie companies.
