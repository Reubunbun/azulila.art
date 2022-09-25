# azulila.art
https://azulila.art/  

![alt text](https://i.imgur.com/8fhp62N.png)
![alt text](https://i.imgur.com/yn1LLfK.png)
![alt text](https://i.imgur.com/Qe4lMn7.png)
![alt text](https://i.imgur.com/WXSZpf8.png)
![alt text](https://i.imgur.com/zTvwqWt.png)

## What is it?
Portfolio website I built for artist Tania Reyes. Includes a full summary on her work on the video game Popslinger, a gallery of her recent work and a form that visitors can fill in to request a submission.  

## The Tech
This project was build using next.js with Typescript, my first proper attempt at both of these and I'm happy with the results. Below I'll list some of the more interesting parts of this project.

### Gallery
I built a separate CMS for this gallery, so that new images could be easily uploaded without me needing to update the code here (https://github.com/Reubunbun/tania-art-portal)  
When images are uploaded through the CMS, they are saved to a relational database table - I then made use of next.js's "getStaticProps" so that when a request is made to the gallery page, image URLs are loaded from the table on the server-side and passed into the page component which will then be rendered on the client-side.  
I also made use of the revalidate feature of getStaticProps so that the images are cached and returned for other responses. The cache will then get revalidated every 5 minutes. This made sense since images will not be uploaded *that* frequently, so when images are cached the requests will be much speedier.

### Commissions
The CMS I built for the gallery also has features for the commission form. This means all the following can be updated without me having to touch the code:
 - The amount of open spaces
 - The prices and types of options, including example images
 - The prices and types of backgrouns, including example images
 - Offers / prices reductions

I opted this time to return this data via an API request, as there's little data to return and everyone will get the most up-to-date information on what can/can't be commisions, prices, and so on.  
  
Users can upload images of examples and references for what they are commissioning, when the commission form is completed an API POST request is made where those images are uploaded to S3, and then SES is used to send an email with all the details of the commission.
