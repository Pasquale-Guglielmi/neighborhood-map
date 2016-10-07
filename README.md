# Frontend Nanodegree Project 5: Neighborhood Map
## Introduction:

This project consists in developing a single page application featuring a map of my neighborhood and in adding functionality to this map including highlighted locations, third-party data about those locations (Wikipedia APIs, in my case) and various ways to browse the content (a text input to filter locations by string-search). The student is expected to make use of the Knockout framework to understand how design patterns can help in developing a manageable codebase.
The project is also designed to make the student interact with API servers (GoogleMaps APIs) and make use of third-party libraries (Wikipedia), loading all data APIs asynchronously and handling errors gracefully.
### How to run the app:

To run the app you can either:
 1.  clone or download this repository and load the *index.html* file in your browser
 2. use this direct [link]()

### How to use the app:

- The single-page app will load a series of locations that will be rendered both as map markers and a list on the left of the screen ( on mobiles, this list can be opened by clicking on the 'hamburger' button).
- The user can click on both list items and map markers, triggering the opening of an infoWindow containing additional information about the related place.
- If Wikipedia articles concerning the selected place will be available, links to these articles will be shown inside the infoWindow.
- The locations-list on the left provides a filter option that uses an input field to filter both the list view and the map markers displayed by default on load.

### Resources:

- **Udacity Courses:** [Intro to AJAX](https://www.udacity.com/course/intro-to-ajax--ud110), [JavaScript Design Patterns](https://www.udacity.com/course/javascript-design-patterns--ud989), [Google Maps APIs by Google](https://www.udacity.com/course/google-maps-apis--ud864)
- **Wikipedia APIs**: [Opensearch](https://www.mediawiki.org/wiki/API:Opensearch)
- **Google Maps**: [Maps JavaScript APIs](https://developers.google.com/maps/documentation/javascript/tutorial)
- **Udacity Discussion Forum**: Handling Google Maps in Async and Fallback
- **Knockout Js**: [Documentation](http://knockoutjs.com/documentation/introduction.html) and [Tutorials](http://learn.knockoutjs.com/)

 #### Possible Improvements:

- Add unique functionality beyond the minimum requirements (i.e. the ability to “favorite” a location, etc.).
- Incorporate a build process allowing for production quality, minified code, to be delivered to the client.
- Data persists when the app is closed and reopened, either through localStorage or an external database (e.g. Firebase).
- Include additional third-party data sources beyond the minimum required.
- Style different markers in different (and functionally-useful) ways, depending on the data set.
- Implement additional optimizations that improve the performance and user experience of the filter functionality (keyboard shortcuts, autocomplete functionality, filtering of multiple fields, etc).
- Integrate all application components into a cohesive and enjoyable user experience.