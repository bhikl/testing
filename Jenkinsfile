pipeline {
    agent none
    tools {
        nodejs "nodenv"
    }
    stages {
        stage('Code Quality Check via SonarQube') {
            agent any
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
        stage("Docker"){
            agent {
                docker {
                    image 'openjdk:11.0.5-slim'
                    args '-v $HOME/.m2:/root/.m2'
                }
            }
            stages {
                stage('Build image') {
                    steps {
                        script {
                            app = docker.build("azionz/itunes-api-fetch")
                        }
                    }
                }
                stage('Push image') {
                    steps {
                        script {
                            docker.withRegistry('https://registry.hub.docker.com', 'dockerhub') {
                                app.push("${env.BUILD_NUMBER}")
                                app.push("latest")
                            }
                        }
                    }
                }
            }
        }
    }
}