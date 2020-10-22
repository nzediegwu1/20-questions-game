<template>
  <div>
    <div class="login-panel" id="portal">
      <b-card class="mt-3 login-card">
        <b-form class="login-form">
          <b-form-group label="Your guess">
            <b-input-group class="mb-2">
              <b-input-group-prepend>
                <div class="form-icon text-center">
                  <i class="fa fa-battery-4"></i>
                </div>
              </b-input-group-prepend>
              <b-form-input
                type="text"
                required
                placeholder="Guess the Czars word"
              ></b-form-input>
            </b-input-group>
          </b-form-group>
          <b-button class="submit-signup" type="submit" variant="primary"
            >Try</b-button
          >
        </b-form>
      </b-card>
    </div>
  </div>
</template>
