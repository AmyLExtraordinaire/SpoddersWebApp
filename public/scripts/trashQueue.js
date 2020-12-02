function trashQueue() {
	$("#draggableContainer").children().each(function() {
		if (this.classList.contains("draggableTile")) {
			manipulateQueue(this.id);
		}
		
	})

	//SkylabSortableListCore( $( '#draggableContainer' ) );
}