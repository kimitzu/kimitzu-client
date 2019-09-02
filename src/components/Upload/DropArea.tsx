import React from 'react'

interface Props {
  placeholder: string
  selectLabel: string
  onImageOpen: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const DropArea = (props: Props) => (
  <div className="js-upload uk-placeholder uk-flex uk-flex-middle uk-flex-center">
    <div>
      <span data-uk-icon="icon: cloud-upload" />
      <span className="uk-text-middle">{props.placeholder}</span>
      <div className="color-primary" data-uk-form-custom>
        <input
          id="image-upload"
          type="file"
          multiple
          onChange={props.onImageOpen}
          accept="image/*"
        />
        {props.selectLabel}
      </div>
    </div>
  </div>
)

export default DropArea
