pipeline {
    agent any
    tools {
        nodejs "nodenv"
        terraform "Terraform"
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
                    -Dsonar.css.node=. \
                    -Dsonar.host.url=http://172.20.0.3:9000"
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
        stage('Terraform Init') {
            steps {
                sh label: '', script: 'terraform -chdir=./terraform/ init'
            }
        }
        stage('Terraform Apply') {
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws_cred']]) {
                    sh label: '', script: 'terraform -chdir=./terraform/ apply -auto-approve '
                }
            }
        }
    }
}