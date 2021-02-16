import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Input, Button } from "react-native-elements";
import { size } from "lodash";
import * as firebase from "firebase";
import { reauthenticate } from "../../utils/api";

export default function ChangePasswordForm(props) {
  const { setShowModal, toastRef } = props;
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState(defualtValue());
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const onChange = (e, type) => {
    setFormData({ ...formData, [type]: e.nativeEvent.text });
  };

  const onSubmit = async () => {
    let isSetErrors = true;
    let errorsTemp = {};
    setErrors({});

    if (
      !formData.password ||
      !formData.newPassword ||
      !formData.repeatNewPassword
    ) {
      errorsTemp = {
        password: !formData.password
          ? "Password is empty"
          : "",
        newPassword: !formData.newPassword
          ? "Password is empty"
          : "",
        repeatNewPassword: !formData.repeatNewPassword
          ? "Password is empty"
          : "",
      };
    } else if (formData.newPassword !== formData.repeatNewPassword) {
      errorsTemp = {
        newPassword: "Password not sa",
        repeatNewPassword: "Password not sa",
      };
    } else if (size(formData.newPassword) < 6) {
      errorsTemp = {
        newPassword: "Minimum 6 chars",
        repeatNewPassword: "Minimum 6 chars",
      };
    } else {
      setIsLoading(true);
      await reauthenticate(formData.password)
        .then(async () => {
          await firebase
            .auth()
            .currentUser.updatePassword(formData.newPassword)
            .then(() => {
              isSetErrors = false;
              setIsLoading(false);
              setShowModal(false);
              firebase.auth().signOut();
            })
            .catch(() => {
              errorsTemp = {
                other: "Error in updating password",
              };
              setIsLoading(false);
            });
        })
        .catch(() => {
          errorsTemp = {
            password: "Incorrect password",
          };
          setIsLoading(false);
        });
    }

    isSetErrors && setErrors(errorsTemp);
  };

  return (
    <View style={styles.view}>
      <Input
        placeholder="Current Password"
        containerStyle={styles.input}
        password={true}
        secureTextEntry={showPassword ? false : true}
        rightIcon={{
          type: "material-community",
          name: showPassword ? "eye-off-outline" : "eye-outline",
          color: "#c2c2c2",
          onPress: () => setShowPassword(!showPassword),
        }}
        onChange={(e) => onChange(e, "password")}
        errorMessage={errors.password}
      />
      <Input
        placeholder="New Password"
        containerStyle={styles.input}
        password={true}
        secureTextEntry={showPassword ? false : true}
        rightIcon={{
          type: "material-community",
          name: showPassword ? "eye-off-outline" : "eye-outline",
          color: "#c2c2c2",
          onPress: () => setShowPassword(!showPassword),
        }}
        onChange={(e) => onChange(e, "newPassword")}
        errorMessage={errors.newPassword}
      />
      <Input
        placeholder="Repeat Password"
        containerStyle={styles.input}
        password={true}
        secureTextEntry={showPassword ? false : true}
        rightIcon={{
          type: "material-community",
          name: showPassword ? "eye-off-outline" : "eye-outline",
          color: "#c2c2c2",
          onPress: () => setShowPassword(!showPassword),
        }}
        onChange={(e) => onChange(e, "repeatNewPassword")}
        errorMessage={errors.repeatNewPassword}
      />
      <Button
        title="Change Password"
        containerStyle={styles.btnContainer}
        buttonStyle={styles.btn}
        onPress={onSubmit}
        loading={isLoading}
      />
      <Text>{errors.other}</Text>
    </View>
  );
}

function defualtValue() {
  return {
    password: "",
    newPassword: "",
    repeatNewPassword: "",
  };
}

const styles = StyleSheet.create({
  view: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 10,
  },
  input: {
    marginBottom: 10,
  },
  btnContainer: {
    marginTop: 20,
    width: "95%",
  },
  btn: {
    backgroundColor: "#00a680",
  },
});