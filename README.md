# URL Shortener Microservice

**User Story:** I can pass a URL as a parameter and I will receive a shortened URL in the JSON response.

**User Story:** If I pass an invalid URL that doesn't follow the valid http://www.example.com format, the JSON response will contain an error instead.

**User Story:** When I visit that shortened URL, it will redirect me to my original link.  

**Example creation usage:**  
   
https://necessary-gas.glitch.me/add/https://www.google.com  
https://necessary-gas.glitch.me/add/http://foo.com:80  
  
**Example creation output**  
  
{ _id: "59aa6814fa65f637ce573faf", shortCode: "zfjri", url: "http://www.google.com", shortenedCount: 5, redirectCount: 1 }  
  
**Usage:**  
  
https://necessary-gas.glitch.me/zfjri  
  
Will redirect to: https://www.google.com/