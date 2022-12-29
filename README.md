# Family Console
> A simple web app showing a family calendar, photos, and a notepad

This is a fun little project I built to turn an old tablet into a "family console" in our house. It displays:
- a calendar with today's events and upcoming events
- calendar entries get colored badges based on keywords in the event name (via config)
- google photos of specified categories (e.g. `people`) pulled from time ranges relative to today (e.g. this time last year)
- a basic notepad for passing messages to each other

<img width="768" alt="image" src="https://user-images.githubusercontent.com/900789/210018083-e7a7410f-08ab-4964-87cf-70d655aebe45.png">

## Running
Before you can run this app you must create `.env` and `src/config.ts` files. There are `.example` versions of both. You'll need Google API OAuth setup with `http://localhost` as a valid redirect URL. Put your Google client id and secret in the `.env` file. The config file contains the settings for how the app behaves, including the calendar id, the time ranges to show, badge coloring rules, photo selection, etc.

## Development

In the project directory, you can run:

#### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

#### `npm run build`

Builds the app for production to the `build` folder.\

## Deploy
Deploying via commandline requires the `aws` commandline tool configured with an access key/secret with the following permissions:
- `S3:PutObject`
- `lambda:UpdateFunctionCode`

### Front-end
The app is almost entirely a single React front-end app. To deploy it it must be built and copied to S3 for hosting.
```
./deploy_app.sh
```

### Lambda
The app relies on Google APIs which require OAuth authentication. Two steps in OAuth require use of the client secret and are therefore run in a lambda: code exchange for token, and refresh. The `/lambda` directory contains the code for these functions, to be exposed as an HTTP-POST-handling lambda function.

To deploy the lambda:
```
./deploy_lambda.sh
```


### API Gateway
Both lambda and S3-hosted front-end code can be exposed through API gateway to appear as a single self-contained app at a single host. The configuration of the gateway is specified in `api-gateway-swagger.yml`. Key settings in API Gateway to make this work correctly are:
1. Ensure you have `image/*` (or equivalent) set to binary mode in the API settings. This ensures the proxy properly serves binary image files
2. Ensure `Content-Type` is passed through the proxy front-to-back

## Attributions
- [Smart-home icon created by Freepik - Flaticon](https://www.flaticon.com/free-icons/smart-home)
