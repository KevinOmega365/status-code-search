SELECT
    [DBObjectID],
    [TSQLCommand]
FROM (
    SELECT
        [DBObjectID],
        [Version],
        [TSQLCommand],
        [PrimKey],
        CurrentVersion = row_number() over(partition by DBObjectID order by version desc)
    FROM [dbo].[sviw_Database_Versions]
    WHERE
        [DBObjectID] like '[al]stp[_]Import[_]%'
        AND [TSQLCommand] like '%INTEGR_REC_STATUS%'
) T
WHERE
    CurrentVersion = 1
ORDER BY
    [DBObjectID]