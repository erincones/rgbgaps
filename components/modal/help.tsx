import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Header } from "../header";
import { Modal } from ".";


/**
 * Help properties
 */
interface Props {
  readonly open?: boolean;
  readonly onClose?: () => void;
}


/** Red channel */
const R = (): JSX.Element => <strong className="text-red-600">R</strong>;

/** Green channel */
const G = (): JSX.Element => <strong className="text-green-600">G</strong>;

/** Blue channel */
const B = (): JSX.Element => <strong className="text-blue-600">B</strong>;

/** RGB text */
const RGB = (): JSX.Element => (
  <strong>
    <span className="text-red-600">R</span>
    <span className="text-green-600">G</span>
    <span className="text-blue-600">B</span>
  </strong>
);


/**
 * Help component
 *
 * @param props Help properties
 */
export const Help = ({ open, onClose }: Props): JSX.Element => {
  return (
    <Modal open={open} onClose={onClose}>
      <Header onClose={onClose}>
        Help
      </Header>
      <div className="text-justify select-text p-4">
        <p>
          Draw colors as points in the <RGB /> space and calculates the
          distances between them using the <strong>euclidean
          distance</strong> for three-dimensional space.
        </p>
        <figure className="text-center px-4 my-4">
          <img alt="d = \sqrt{\left(x_1 - x_0\right)^2 + \left(y_1 - y_0\right)^2 + \left(z_1 - z_0\right)^2}" src="/distance.png" />
          <figcaption className="text-blueGray-600 text-sm">Euclidean distance for three-dimensional space</figcaption>
        </figure>
        <p>
          The <RGB /> space is represented as
          an <strong>euclidean 3D space</strong> when each chanel correspond to
          the <strong>OpenGL</strong> spacial cartesian cordinates axis, thus
          the red (<R />), green (<G />) and blue (<B />) channel are
          represented along the <strong>X</strong> (<i>right</i>
          ), <strong>Y</strong> (<i>up</i>) and <strong>Z</strong> (<i>out the
          screen</i>) axis respectively.
        </p>
        <p>
          You can controle some camera and render options from the sidebar and
          modify the color palette using the text editor.
        </p>
        <p>
          <small>
            <strong>Note:</strong> This tool still may not work properly with
            touch screens.
          </small>
        </p>
        <div className="flex flex-wrap text-sm mt-8">
          <div className="w-full sm:w-5/6">
            <p>
              Developed by <a href="https://github.com/erincones" target="noopener noreferrer" className="text-lightBlue-800 underline">Erick Rincones</a>.
            </p>
            <p>
              Licensed under <a href="https://github.com/erincones/rgbgaps/blob/master/LICENSE" target="noopener noreferrer" className="text-lightBlue-800 underline">the MIT License</a>.
            </p>
          </div>
          <div className="flex justify-center items-center text-blueGray-600 w-full sm:w-1/6">
            <a href="https://github.com/erincones/rgbgaps" title="Source code" target="noopener noreferrer" className="text-lightBlue-800 underline">
              <FontAwesomeIcon icon={[ `fab`, `github` ]} fixedWidth className="text-2xl" />
            </a>
          </div>
        </div>
      </div>
    </Modal>
  );
};
