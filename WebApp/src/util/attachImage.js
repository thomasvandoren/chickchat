const MAX_IMAGE_SIZE_BYTES = 20 * 1024 * 1024  // 20 MB

/**
 * To use:
 * import attachImage from "src/util/attachImage"
 *
 * And add the following to the component class:
 * onAttachImage = attachImage.bind(this)
 *
 * Now you can render an HTML5 file input, e.g.:
 * <input type="file" onChange={this.onAttachImage} />
 */
export default function attachImage (e) {
  e.preventDefault()
  const file = e.target.files[0]
  const fr = new FileReader()
  fr.onload = () => {
    if (!fr.result.startsWith('data:image')) {
      this.setState({uploadError: 'Only images, please!'})
    } else if (fr.result.length > MAX_IMAGE_SIZE_BYTES) {
      this.setState({uploadError: `Only images under ${MAX_IMAGE_SIZE_BYTES} bytes, please!`})
    } else {
      this.setState({data: fr.result})
    }
  }
  fr.readAsDataURL(file)
}
