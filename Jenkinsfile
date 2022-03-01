pipeline {
    agent any
    tools {nodejs "nodenv"}
    stages {
        stage('Code Quality Check via SonarQube') {
            steps {
                script {
                    def scannerHome = tool 'sonarqube';
                    withSonarQubeEnv("sonarqube-container") {
                    sh "${tool("sonarqube")}/bin/sonar-scanner -X \
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
        stage('install_deps') {
            steps {
                sh "sudo apt install wget zip python-pip -y"
                sh "cd /tmp"
                sh "curl -o terraform.zip https://releases.hashicorp.com/terraform/'$terraform_version'/terraform_'$terraform_version'_linux_amd64.zip"
                sh "unzip terraform.zip"
                sh "sudo mv terraform /usr/bin"
                sh "rm -rf terraform.zip"
            }
        }

        stage('init_and_plan') {
            steps {
                sh "sudo terraform init $jenkins_node_custom_workspace_path/workspace"
                sh "sudo terraform plan $jenkins_node_custom_workspace_path/workspace"
            }
        }



        stage('apply_changes') {
            steps {
                sh "echo 'yes' | sudo terraform apply $jenkins_node_custom_workspace_path/workspace"
            }
        }
    }
}