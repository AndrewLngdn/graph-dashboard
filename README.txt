Start the application with:

`npm start`


Copied from index.html:

My goal with this project was to decouple the functionality of this dashboard from the given dataset so it can be reused with a different endpoint and still be useful. I've reached that goal with moderate success. This dashboard will generate filters and graph timeseries data that is in the correct input format. It makes only a few assumptions about the dataset that's being passed in. In its current state, the input must contain some date column, one y-axis label column , and one value column. An options hash must be provided as shown below. I'm going to continute to tweak this project until it can handle all sorts of datasets and can be useful with many other inputs.

Currently the graphing library creates the filters based on the order of the columns, so it's beneficial to put the y-axis label column before the filters. New iterations will support re-ordering of the filter buttons.

I've shown how the project reacts to different datasets by feeding the challenge set and also a dataset containing GDP timeseries data. The new dataset can be loaded by clicking the div containing the options and the dataset preview.

The user must inform the dashboard of the header for both the date column and y-axis column in the options hash, as the dashboard will make no assumptions about the names of the y-axis column or date column (although this could be changed if we knew we had consistent input).

There are many more features and fixes I would have implemented if I had more time for this project. The CSS could use a pre-processor to keep it more organized. The 'graph.js' file contains lots of data manipulation and and also renders the graph. It would probably be easier to read if the graph had a dedicated data-manipulation component separate from the rendering. Since this was my first time building a non-trivial project in React.js, I learned a lot about how to organize React.js code while working. I'm pretty confident that could remove about 50 lines of code while restructuring the project to be more readable. Also I would have liked to pull more datapoints for the second demonstration