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
        stage("Install Project Dependencies") {
            steps {
                nodejs(nodeJSInstallationName: 'nodenv'){
                sh "npm install"
                }
            }
        }
    }
}