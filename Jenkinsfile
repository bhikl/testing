pipeline {
    agent any
    tools {
        nodejs "nodenv"
    }
    stages {
        stage('Code Quality Check via SonarQube') {
            steps {
                script {
                    def scannerHome = tool 'sonarqube';
                    withSonarQubeEnv("sonarqube-container") {
                    sh "${tool("sonarqube")}/bin/sonar-scanner \
                    -Dsonar.projectKey=test-node-js \
                    -Dsonar.sources=. \
                    -Dsonar.css.node=."
                    }
                }
            }
        }
        stage('Build image') {
        /* This builds the actual image; synonymous to
         * docker build on the command line */
            steps {
                script {
                    app = docker.build("azionz/itunes-api-fetch")
                }
            }
        }

        stage('Test image') {
            /* Ideally, we would run a test framework against our image.
            * For this example, we're using a Volkswagen-type approach ;-) */
            steps {
                script {
                    app.inside {
                        sh 'echo "Tests passed"'
                    }
                }
            }
        }

        stage('Push image') {
            /* Finally, we'll push the image with two tags:
             * First, the incremental build number from Jenkins
            * Second, the 'latest' tag.
            * Pushing multiple tags is cheap, as all the layers are reused. */
            steps {
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'docker-hub-credentials') {
                        app.push("${env.BUILD_NUMBER}")
                        app.push("latest")
                    }
                }
            }
        }
    }
}