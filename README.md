# mediabox


To try out the project you can visit https://d17bv7qwefaqwx.cloudfront.net/ and create a user by signing up.
You can also login using my user credentials in order to see and interact with some preseeded data

email: jeevan.thomaskoshy@gmail.com
password: Temp1234

The project is Organised into Three folders , infra, frontend and backend

# infra
About 80-90% of the AWS infrasture for this project is deployed via Infrastucture as Code. I create a few items like cloudfront cdn/ s3 website hosting manually via the console. I have used Serverless Framework for IaC in this project. 

In order to deploy the same to your account, you should change the aws profile mentioned in each of the serverless.yml files to a profile in an AWS account you have access to. 

Once that is done, the deployment process is faily straightforward

Go to each folder where there is a serverless.yml file specified, and type ```serverless deploy```


# frontend

The frontend for this project is built using angular and in order to run the same locally, you can do to 

```cd frontend/mediabox-frontend/```
```npm i```
```ng serve```

The application will start on localhost:4200


# backend

The backend is completely serverless on AWS and is deployed using the Serverless framework. In order to deploy, you need to modify an AWS profile to one that you own. After the same, you can do 

```cd backend```
```serverless deploy```




