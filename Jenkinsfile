pipeline {
    agent any
    tools {nodejs "NodeJS"}
    triggers {
      pollSCM('')  //enables polling, allowing post-commit hook to be handled
    }
    stages {
        stage('browserstack-tests') {
            steps {
                browserstack(credentialsId: '68b1a5d2-4c09-4df8-860d-b7f5df5c00a4') {
                    properties([pipelineTriggers([[githubPush()]])])
                    sh 'npm install'
                    sh 'npm run parallel'
                }
            }
        }
    }
}
