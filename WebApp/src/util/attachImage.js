const MAX_IMAGE_SIZE_BYTES = 16 * 1024 * 1024

export default function attachImage (this, e) {
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
