

THREE.DragControls = function ( _objects, _camera, _domElement, armConfig ) {

	if ( _objects instanceof THREE.Camera ) {
		console.warn( 'THREE.DragControls: Constructor now expects ( objects, camera, domElement )' );
		var temp = _objects; _objects = _camera; _camera = temp;
	}
	var _plane = new THREE.Plane();
	var _raycaster = new THREE.Raycaster();

	var _mouse = new THREE.Vector2();
	var _offset = new THREE.Vector3();
	var _intersection = new THREE.Vector3();
	var _selected = null, _hovered = null;
	var scope = this;
	var arm = armConfig;


	function activate() {

		_domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );
		_domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
		_domElement.addEventListener( 'mouseup', onDocumentMouseUp, false );

	}

	function deactivate() {

		_domElement.removeEventListener( 'mousemove', onDocumentMouseMove, false );
		_domElement.removeEventListener( 'mousedown', onDocumentMouseDown, false );
		_domElement.removeEventListener( 'mouseup', onDocumentMouseUp, false );
	}
	function dispose() {
		deactivate();

	}

	function onDocumentMouseMove( event ) {
 		var totalX, totalY;
		var boundary = _domElement.getBoundingClientRect();

		var mouseX = event.clientX - boundary.left;
		var mouseY = event.clientY - boundary.top;
		 _mouse.x = ( mouseX / _domElement.width ) * 2 - 1 ;
		 _mouse.y = - ( mouseY / _domElement.height ) * 2 + 1;

		_raycaster.setFromCamera( _mouse, _camera );
		//console.log(_raycaster);
		if ( _selected && scope.enabled ) {
			if ( _raycaster.ray.intersectPlane( _plane, _intersection ) ) {
				_selected.position.copy( _intersection.sub( _offset ) );
				console.log(_selected.position);
				KinematicsModule.inverseKinematics(_selected.position.x, _selected.position.z, _selected.position.y,50, arm,kinematicsType)
			}
			scope.dispatchEvent( { type: 'drag', object: _selected } );
			return;
		}
		_raycaster.setFromCamera( _mouse, _camera );
		var intersects = _raycaster.intersectObjects( _objects );
		if ( intersects.length > 0 ) {
			var object = intersects[ 0 ].object;
			_plane.setFromNormalAndCoplanarPoint( _camera.getWorldDirection( _plane.normal ), object.position );
			if ( _hovered !== object ) {
				scope.dispatchEvent( { type: 'hoveron', object: object } );
				_domElement.style.cursor = 'pointer';
				_hovered = object;
			}
		} else {
			if ( _hovered !== null ) {
				scope.dispatchEvent( { type: 'hoveroff', object: _hovered } );
				_domElement.style.cursor = 'auto';
				_hovered = null;

			}

		}

	}

	function onDocumentMouseDown( event ) {
		event.preventDefault();
		_raycaster.setFromCamera( _mouse, _camera );
		var intersects = _raycaster.intersectObjects( _objects );
		console.log(intersects);
		if ( intersects.length > 0 ) {
			_selected = intersects[ 0 ].object;
			if ( _raycaster.ray.intersectPlane( _plane, _intersection ) ) {
				_offset.copy( _intersection ).sub( _selected.position );
			}
			_domElement.style.cursor = 'move';
			scope.dispatchEvent( { type: 'dragstart', object: _selected } );
		}
	}

	function onDocumentMouseUp( event ) {
		event.preventDefault();
		if ( _selected ) {
			scope.dispatchEvent( { type: 'dragend', object: _selected } );
			_selected = null;
		}
		_domElement.style.cursor = 'auto';
	}
	activate();
	this.enabled = true;
	this.activate = activate;
	this.deactivate = deactivate;
	this.dispose = dispose;
};

THREE.DragControls.prototype = Object.create( THREE.EventDispatcher.prototype );
THREE.DragControls.prototype.constructor = THREE.DragControls;
