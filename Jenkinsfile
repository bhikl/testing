node {

    checkout scm

    docker.withRegistry('https://registry.hub.docker.com', 'dockerhub') {

        def customImage = docker.build("azionz/itunes-api-fetch")

        /* Push the container to the custom Registry */
        customImage.push()
    }
}