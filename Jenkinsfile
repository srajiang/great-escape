pipeline {
    agent any
    environment {
        BUILD_ID="dontKillMe"
        JENKINS_NODE_COOKIE="dontKillMe"
    }
    tools {nodejs "NodeJS"}
    stages {
        stage('build') {
            steps {
                sh 'npm --version'
            }
        }
        stage('browserstack-tests') {
            steps {
                browserstack(credentialsId: '68b1a5d2-4c09-4df8-860d-b7f5df5c00a4') {
                    sh 'export JENKINS_NODE_COOKIE=dontKillMe'
                    sh 'export BUILD_ID=dontKillMe'
                    sh 'npm install'
                    sh 'npm run local'
                }
            }
        }
    }
}
