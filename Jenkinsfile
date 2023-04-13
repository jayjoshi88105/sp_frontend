pipeline {
    agent any

    tools { nodejs 'node' }

    stages {
        stage('Git') {
            steps {
                git 'https://github.com/jayjoshi88105/sp_frontend.git'
            }
        }

        stage('Build') {
            steps {
                sh 'npm install'
                sh 'gulp webpack'
            }
        }

        stage('Test') {
            steps {
                sh 'node test'
            }
        }
    }
}
