pipeline {
    agent any
    tools {nodejs "NodeJS"}
    node {
      env.NODEJS_HOME = "${tool nodejs}"
      env.PATH="${env.NODEJS_HOME}/bin:${env.PATH}"
      sh 'npm --version'
    }
    stages {
        stage('browserstack-tests') {
            steps {
                browserstack(credentialsId: '68b1a5d2-4c09-4df8-860d-b7f5df5c00a4') {
                    sh 'npm run parallel'
                }
            }
        }
    }
}
