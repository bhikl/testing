pipeline {
    agent {
        kubernetes {
            label 'kaniko'
            yaml """
kind: Pod
metadata:
  name: kaniko
spec:
  containers:
  - name: nodejs
    image: node:17.6-alpine3.14
    command:
    - cat
    tty: true
  - name: kaniko
    image: gcr.io/kaniko-project/executor:debug
    imagePullPolicy: Always
    command:
    - /busybox/cat
    tty: true
    volumeMounts:
      - name: jenkins-docker-cfg
        mountPath: /kaniko/.docker
  volumes:
  - name: jenkins-docker-cfg
    projected:
      sources:
      - secret:
          name: registry-credentials
          items:
            - key: .dockerconfigjson
              path: config.json
"""
        }
    }
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
      stage('Build') {
        agent "kaniko"
          steps {
              container('nodejs') {
                  sh 'npm i'
              }
          }
      }
      stage('Make Image') {
        agent "kaniko"
          environment {
              PATH        = "/busybox:$PATH"
              REGISTRY    = 'index.docker.io' // Configure your own registry
              REPOSITORY  = 'azionz'
              IMAGE       = 'itunes-api-fetch'
          }
          steps {
            container(name: 'kaniko', shell: '/busybox/sh') {
              sh '''#!/busybox/sh
                  /kaniko/executor -f `pwd`/Dockerfile -c `pwd` --cache=true --destination=${REGISTRY}/${REPOSITORY}/${IMAGE}:prod_${GIT_COMMIT} \
                  --destination=${REGISTRY}/${REPOSITORY}/${IMAGE}:latest
                  '''
            }
          }
      }
      stage('Update Image') {
        agent any
        steps{
          script{
            sh "kubectl set image deployment/itunes-api-fetch itunes-api-fetch-cont=azionz/itunes-api-fetch:prod_${GIT_COMMIT} -n default"
          }
        }
      }
    }
}