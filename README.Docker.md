### Building and running your application

When you're ready, start your application by running:
`docker build -t neemsah_admin .`.

#### This will build the image now we need to expose the app at http://localhost:5173. 

##### TO do this run bellow command
`docker run -p 5173:5173 neemsah_admin`.