UPDATE tickets
SET ticket_status = @new_status,
agg_version = agg_version + 1,
WHERE ticket_id=@id and agg_version=@expected_version;