FROM reactnativecommunity/react-native-android:latest

WORKDIR /opt/appp

COPY . .

RUN yarn set version berry && yarn install && cd android && chmod +x gradlew && ./gradlew assembleRelease