create table nodes( id serial primary key, label varchar(256) );
create table edges( 
	id serial primary key, 
	relation varchar(256), 
	source_id int,
	target_id int, 
	constraint fk_source foreign key(source_id) references nodes(id)
);