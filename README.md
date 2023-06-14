# breadboard-test-challenge

Steps to test out solution:
1. run `npm install`
2. run `npm run dev`
3. to test out API endpoint use `http://localhost:3000/api/aggregated-part?partNumber=0510210200`.
4. you can also test out `http://localhost:3000/api/aggregated-part` and it will work the same way as step 3.
5. the endpoint is setup to return data whose part number starts with what ever is in the query. and return all results if there is no partNumber in the query.
6. to test out the client, use `http://127.0.0.1:5174/aggregate-parts?partNumber=0510210200`
7. there is a searchbox for looking up a particular part number/ partnumbers that start with whatever is in the string.
