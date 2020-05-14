pipeline {
    agent any
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
                    sh 'npm run parallel'
                }
            }
        }
    }
}
