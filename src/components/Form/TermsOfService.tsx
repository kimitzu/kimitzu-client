import React from 'react'

// TODO: move somewhere else
const termsOfService =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nunc mattis enim ut tellus elementum sagittis vitae. Dignissim suspendisse in est ante in nibh. Auctor augue mauris augue neque gravida. Penatibus et magnis dis parturient montes. Quisque sagittis purus sit amet volutpat. Aliquam nulla facilisi cras fermentum odio. Tellus pellentesque eu tincidunt tortor aliquam nulla facilisi cras fermentum. Mauris sit amet massa vitae tortor condimentum lacinia quis. Ut lectus arcu bibendum at varius vel pharetra vel. Duis convallis convallis tellus id interdum. Sed egestas egestas fringilla phasellus faucibus. Eget arcu dictum varius duis at consectetur lorem donec. Cursus risus at ultrices mi tempus. Tincidunt ornare massa eget egestas purus viverra. Diam donec adipiscing tristique risus nec feugiat in.'

const TermsOfService = () => (
  <form className="uk-form-stacked">
    <fieldset className="uk-fieldset">
      <legend id="form-title" className="uk-legend color-primary">
        Terms of Service
      </legend>
    </fieldset>
    <div className="uk-margin">
      <textarea id="terms" className="uk-textarea" rows={18} value={termsOfService} disabled />
    </div>
  </form>
)

export default TermsOfService
