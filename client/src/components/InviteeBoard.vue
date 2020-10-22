<template>
  <div class="text-center" id="portal">
    <b-container>
      <b-row>
        <b-col
          ><b-card header="Think of a word" header-tag="header">
            <b-form class="login-form">
              <b-form-group description="Your Listener Will Guess Your Word">
                <b-input-group class="mb-2">
                  <b-input-group-prepend>
                    <div class="form-icon">
                      <i class="fa fa-envelope"></i>
                    </div>
                  </b-input-group-prepend>
                  <b-form-input
                    type="text"
                    required
                    placeholder="Enter your word"
                  ></b-form-input>
                </b-input-group>
              </b-form-group>
              <b-button class="submit-signup" type="submit" variant="primary"
                >Save</b-button
              >
            </b-form>
          </b-card>
        </b-col>
        <b-col cols="8" class="text-center">
          <b-card header="20 Questions" header-tag="header">
            Your Listener's Guess Goes Here...
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
